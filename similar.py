import sys, urllib, re, threading, pycurl, curl, json, datetime

API_KEY="hsrw7wujsw9q5mwjujhtmfdk"
CALAIS_URL="http://api.opencalais.com/enlighten/calais.asmx/Enlighten"
REGEX = re.compile("<string[^>]*>(.*)</string>")
DATE_REGEX = re.compile("(\d{4})(\d{2})(\d{2})")
PARAMS = '<c:params xmlns:c="http://s.opencalais.com/1/pred/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><c:processingDirectives c:contentType="text/raw" c:outputFormat="application/json"></c:processingDirectives><c:userDirectives /><c:externalMetadata /></c:params>'

class ThreadQuery(threading.Thread):
    def __init__(self, query):
        threading.Thread.__init__(self)
        self.query = query
        self.results = None

    def run(self):
        self.results = nytimes.NYTimes().get_results(self.query)

class NewsItem:
    def __init__(self, d):
        yyyymmdd = map(int, self.DATE_REGEX.match(d['date']).groups())
        self.date = datetime.date(*yyyymmdd)
        self.url = unicode_to_ascii(d['url'])
        self.title = unicode_to_ascii(d.get("title",""))
        self.body = unicode_to_ascii(d.get("body",""))
        
        if self.title == "" and self.body != "":
            self.title = self.body.splitlines()[0]
        elif self.body == "" and self.title != "":
            self.body = self.title

    def __cmp__(self, y):
        return cmp(self.date, y.date)

class News:
    def __init__(self, title, brief, body):
        self.title = title
        self.brief = brief
        self.body = body

def get_terms(news):
    postval = {}
    postval["licenseId"] = API_KEY
    postval["paramsXML"] = PARAMS
    postval["content"] = news.title + news.brief #+ news.body

    curlobj = curl.Curl()
    curlobj.set_option(pycurl.HTTPHEADER,["SOAPAction"])
    curlobj.set_option(pycurl.NOSIGNAL,1)

    s = curlobj.post(CALAIS_URL, postval)
    result = REGEX.findall(s)[0]
    results = [ r for r in json.loads(result).values() if r.has_key("_typeGroup") and r["_typeGroup"] == "entities" ]
    return results

def rank_terms(self, terms, n):
    terms.sort(key = lambda x: x['relevance'], reverse = True)
    return [(x['name'], x['relevance']) for x in terms[:min(n, len(terms))]]

def select_news(news, queries):
    s = set()
    for x, results in zip(queries, news):
        for n in results:
            s.add(n)
    return list(s)

def get_news(queries):
    queries = [x for (x,y) in queries]
    pool = []
    results = []
    for q in queries:
        t = ThreadQuery(q)
        pool.append(t)
        t.start()

    for t in pool:
        t.join()
        try:
            if t.results.results():
                try:
                    news = t.results.results()['results']
                except KeyError, e:
                    news = None
                if type(news)==list:
                    results.append(news)
                elif type(news)==dict:
                    results.append([news])
        except AttributeError, e:
            pass
    return results

def parse_text(uri):
    title, brief, body = urllib.urlopen(uri).read().split('\n\n', 2)
    terms = get_terms(News(title, brief, body))
    terms = rank_terms(terms, 5)
    print terms

    queries = get_queries(terms, 4)
    queries.sort(key=lambda x: x[1], reverse=True)
    queries = queries[:min(5,len(queries))]

    news = get_news(queries)
    news = [[NewsItem(a) for a in group] for group in news]
    news = select_news(news, queries)
    news.sort(reverse=True)

    for n in news:
        print n

def main():
    if len(sys.argv)==2:
        parse_text(sys.argv[1]) 
    else:
        print sys.argv[0], 'uri'

if __name__=='__main__':
    main()

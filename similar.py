import sys, urllib, re, threading, pycurl, curl, json, requests
import dateutil.parser

CALAIS_KEY="hsrw7wujsw9q5mwjujhtmfdk"
GUARDIAN_KEY="test"
CALAIS_URL="http://api.opencalais.com/enlighten/calais.asmx/Enlighten"
REGEX = re.compile("<string[^>]*>(.*)</string>")
PARAMS = '<c:params xmlns:c="http://s.opencalais.com/1/pred/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><c:processingDirectives c:contentType="text/raw" c:outputFormat="application/json"></c:processingDirectives><c:userDirectives /><c:externalMetadata /></c:params>'

class ThreadQuery(threading.Thread):
    def __init__(self, query):
        threading.Thread.__init__(self)
        self.query = query
        self.results = None

    def run(self):
        endpoint = self.build_endpoint()
        self.results = self.access_url(endpoint)
        #with open(self.query, 'w') as f:
        #    f.write(str(self.results))

    def build_endpoint(self):
        return 'http://content.guardianapis.com/search?q='+self.query.replace(' ','%20')+'&api-key='+GUARDIAN_KEY+'&show-fields=all&page-size=10&page=1'
        #return 'http://content.guardianapis.com/search?q='+self.query.replace(' ','%20')+'%20drought&sectionName=environment&api-key='+GUARDIAN_KEY+'&show-fields=all&page-size=10&page=1'
        #return 'http://content.guardianapis.com/search?q='+self.query.replace(' ','%20')+'&api-key='+GUARDIAN_KEY+'&page-size=10&page=1'

    def access_url(self, endpoint):
        results = []
        r = requests.get(endpoint)
        if r.status_code == 200:
            j = json.loads(r.text)
            results.extend(j['response']['results'])
        return results

class News:
    def __init__(self, d):
        self.date = dateutil.parser.parse(d[u'webPublicationDate']).date()
        self.url = u2a(d[u'fields']['shortUrl'])
        self.title = u2a(d.get("webTitle",""))
        self.body = u2a(d[u'fields'].get("body",""))
        
        if self.title == "" and self.body != "":
            self.title = self.body.splitlines()[0]
        elif self.body == "" and self.title != "":
            self.body = self.title

    def __cmp__(self, y):
        return cmp(self.date, y.date)

    def __hash__(self):
        return self.title.__hash__()

    def __repr__(self):
      s = "%10s \t %80s"%(str(self.date), self.title[:80])
      s += "\n"
      s += "%10s \t %100s"%("".rjust(10), self.url[:100])
      return s

    def __str__(self):
        return self.__repr__()

    def toDict(self):
        d = {}
        d["date"] = str(self.date)
        d["url"] = self.url
        d["title"] = self.title
        return d

def get_terms(title, brief, body):
    postval = {}
    postval["licenseId"] = CALAIS_KEY
    postval["paramsXML"] = PARAMS
    postval["content"] = title + ' ' + brief #+ body

    curlobj = curl.Curl()
    curlobj.set_option(pycurl.HTTPHEADER,["SOAPAction"])
    curlobj.set_option(pycurl.NOSIGNAL,1)

    s = curlobj.post(CALAIS_URL, postval)
    result = REGEX.findall(s)[0]
    results = [r for r in json.loads(result).values() if r.has_key("_typeGroup") and r["_typeGroup"] == "entities"]
    return results

def rank_terms(terms, n):
    terms.sort(key = lambda x: x['relevance'], reverse = True)
    return [(x['name'], x['relevance']) for x in terms[:min(n, len(terms))]]

def select_news(news, queries):
    s = set()
    for q, results in zip(queries, news):
        for n in results:
            s.add(n)
    return list(s)

def select_news_new(news, queries):
    newsdict = {}
    for q, results in zip(queries, news):
        for n in results:
            if not n in newsdict:
                newsdict[n] = q[1]
    news = newsdict.items()
    news.sort(key=lambda x: x[0].date)

    groups = timegroup(news, lambda x: x[0].date, 7)
    news = []
    for g in groups:
        g.sort(key=lambda x: x[1], reverse=True)
        if len(g) > 3:
            news += map(lambda x: x[0], g[:2])
        else:
            news.append(g[0][0])

    news.sort(reverse=True)
    return news

def timegroup(collection, key_func, duration):
    groups = []
    baseline = collection[0]
    group = []
    for item in collection:
        if (key_func(item) - key_func(baseline)).days <= duration:
            group.append(item)
        else:
            baseline = item
            groups.append(group)
            group = [item]

    if len(group) > 0:
        groups.append(group)
    return groups

def u2a(text):
    li = []
    for c in text:
        if ord(c) < 128:
            li.append(c)
        else:
            li.append(' ')

    return ''.join(li)

def get_news(queries):
    queries = [u2a(x) for (x,y) in queries]
    pool = []
    results = []
    for q in queries:
        t = ThreadQuery(q)
        pool.append(t)
        t.start()

    for t in pool:
        t.join()
        if t.results:
            results.append(t.results)
    return results

def get_queries(terms, n):
    terms = terms[:n]
    return [(' '.join(x), sum(y)) for (x,y) in [zip(*group) for group in cross_product(terms)]]

def cross_product(l):
    return reduce(lambda z, x: z + [y + [x] for y in z], l, [[]])[1:]

def parse_text(uri):
    title, brief, body = urllib.urlopen(uri).read().split('\n\n', 2)
    terms = get_terms(title, brief, body)
    terms = rank_terms(terms, 5)

    queries = get_queries(terms, 4)
    queries.sort(key=lambda x: x[1], reverse=True)
    queries = queries[:min(5,len(queries))]

    news = get_news(queries)
    news = [[News(a) for a in group] for group in news]
    news = select_news_new(news, queries)
    print len(news)
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

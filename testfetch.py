import requests as re
import json

#api_key = "53uwfd75gxvedw3ew3w5vpc4"
api_key = "test"

#with open('guardian_drought.json','r') as json_input:
#  json_file = json.load(json_input)

#pages = xrange(1,40)
pages = range(1,2)

for page in pages:
  r = re.get('http://content.guardianapis.com/search?q=drought&sectionName=environment&api-key='+api_key+'&show-fields=all&page-size=10&page='+str(page))
  if r.status_code == 200:
     j = json.loads(r.text)
     print j['response']['results']
     #json_file = json_file + j['response']['results']
     #print 'Iteration'
     #with open('guardian_drought.json','w') as json_output:
     #   json.dump(json_file,json_output)

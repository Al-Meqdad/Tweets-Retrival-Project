from markupsafe import escape_silent
import Validation
from requests import request
import json
from elasticsearch import Elasticsearch
es = Elasticsearch(hosts=["http://localhost:9200"], http_compress=True)



def FetchAndCheckAll(data):
    
    Label = data['Dlabel']
    Query = {
        "query": {
            "bool": {
                "filter":
                    [{"geo_bounding_box": {"coordinates": {"bottom_left": [data['BottomLeft'][0], data['BottomLeft'][1]], "top_right": [data['UpperRight'][0], data['UpperRight'][1]]}}},
                     ]
            }
        },
        "aggs": {"group_by_"+Label: {"date_histogram": {"field": "created_at", "calendar_interval": data['Dlabel']}}},
    }

    if "Word" in data.keys():
        Query["query"]["bool"]["filter"].append(
            {"match": {"text": Validation.textVal(data["Word"])}})

    if 'Start_Time' and 'End_Time' in data.keys():
        Query["query"]["bool"]["filter"].append(
            {"range": {"created_at": {"gte": data['Start_Time'], "lte": data['End_Time']}}})

    res = es.search(index="tweets", body=Query,  size=10000)
    return (res['hits']['hits'], res['aggregations'])

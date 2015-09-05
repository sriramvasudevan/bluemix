import pandas as pd

def getStories(keyword):
  df = pd.read_csv('model/' + keyword + '.csv')
  # Handle NaN
  df = df.where((pd.notnull(df)), None)
  # Get Top - 5 clusters
  top_clusterIds = df['cluster_no'].unique()[:5]
  response = []

  for clusterId in top_clusterIds:
    filtered_df = df[df['cluster_no'] == clusterId]
    # Sort on basis of date
    filtered_df.date = pd.to_datetime(filtered_df.date)
    filtered_df = filtered_df.sort('date')

    filtered_dict = filtered_df.to_dict(orient='records')
    response.append(filtered_dict)
    print len(response), len(filtered_dict)

  return response
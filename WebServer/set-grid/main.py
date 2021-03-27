from google.cloud import firestore

def set_grid(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # Check json
    request_json = request.get_json()
    
    if not all(i in list(request_json.keys()) for i in ['user_id', 'secret', 'grid']):
      return ({'error': 'missing-keys'}, 400, headers)

    # Check auth
    firestore_client = firestore.Client()

    user_doc = firestore_client.collection('users').document(request_json['user_id']).get()
    
    if not user_doc.exists:
      return ({'error': 'no-such-user'}, 400, headers)

    user_info = user_doc.to_dict()
    secret = user_info.get('secret')

    if secret != request_json['secret']:
      return ({'error': 'incorrect-secret'}, 400, headers)

    user_info['grid'] = request_json.get('grid', [])

    firestore_client.collection('users').document(request_json['user_id']).set(user_info, merge=True)
    return ({'success': True}, 200, headers)

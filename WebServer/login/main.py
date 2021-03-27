from google.cloud import firestore

def login(request):
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

    # Check the keys
    request_json = request.get_json()

    if not all(i in list(request_json.keys()) for i in ['user_id', 'secret']):
      return {'error': 'missing-keys'}

    # Check the auth
    firestore_client = firestore.Client()
    user_ref = firestore_client.collection('users').document(request_json['user_id']).get()
    if not user_ref.exists:
      return {'error': 'invalid-user-id'}

    user_data = user_ref.to_dict()

    if user_data.get('secret') != request_json['secret']:
      return {'error': 'invalid-secret'}

    return ({'success': True}, 200, headers)

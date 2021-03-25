from google.cloud import firestore

def set_config(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    # Check json
    request_json = request.get_json()
    
    if not all(i in list(request_json.keys()) for i in ['user_id', 'secret', 'config']):
      return {'error': 'missing-keys'}

    # Check auth
    firestore_client = firestore.Client()

    user_doc = firestore_client.collection('users').document(request_json['user_id']).get()
    
    if not user_doc.exists:
      return {'error': 'no-such-user'}

    user_info = user_doc.to_dict()
    secret = user_info.get('secret')

    if secret != request_json['secret']:
      return {'error': 'incorrect-secret'}

    old_config = user_info.get('config', {})
    old_config.update(request_json['config'])
    user_info['config'] = old_config

    firestore_client.collection('users').document(request_json['user_id']).set(user_info, merge=True)
    return {'success': True}

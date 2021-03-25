from google.cloud import firestore

def get_config(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
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

    user_data.pop('secret')
    # Check if config has changed
    config_changed = user_data.get('config_flag', True)

    # Return object
    if config_changed:
      # user_ref.set('config_flag', False)
      return user_data

    return user_data

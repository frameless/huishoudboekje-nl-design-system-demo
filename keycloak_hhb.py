#!/usr/bin/python3
import os,requests
# pip3 install python-keycloak
from keycloak import KeycloakAdmin
import json

class KeyCloakApi:
    def __init__(self, auth_username, auth_password, auth_realm, auth_keycloak_url, auth_client_id, realm_name, verify = True):
        self.keycloak_admin = None
        self.auth_username = auth_username
        self.auth_password = auth_password
        self.auth_realm = auth_realm
        self.auth_keycloak_url = auth_keycloak_url
        self.auth_client_id = auth_client_id
        self.realm_name = realm_name
        self.verify = verify
        self.connect()

    def connect(self):
        self.keycloak_admin = KeycloakAdmin(server_url=self.auth_keycloak_url,
                                            username=self.auth_username,
                                            password=self.auth_password,
                                            realm_name=self.realm_name,
                                            user_realm_name=self.auth_realm,
                                            verify=self.verify)

    def create_update_user(self, username, email, enabled=True, firstName=None, lastName=None, password=None, update_password_if_user_exists=False):
        user_id = self.keycloak_admin.get_user_id(username)
        user_found = False
        user_chanched = False

        json_input = {"email": email,
                      "username": username,
                      "enabled": enabled,
                      "firstName": "" if firstName is None else firstName,
                      "lastName": "" if lastName is None else lastName}

        if user_id is not None:
            user_found = True
            user = self.keycloak_admin.get_user(user_id)
            user_chanched = self.compare(json_input, user)

        if password:
                json_input["credentials"] = [
                        {"value": password, "type": "password", }]
        # user toevoegen als hij niet bestaad
        # or
        # user updaten als deze is veranderd
        # or
        # altijd password aanpassen als dit gevraagd word == change
        if user_found == False:
            self.keycloak_admin.create_user(json_input)
            return True
        elif user_chanched or update_password_if_user_exists:
            self.keycloak_admin.update_user(user_id, json_input)
            return True

        return False

    def del_user(self, username=None, email=None):
        users = self.keycloak_admin.get_users()
        user_deleted = False
        for user in users:
            if ((username and (user['username'] == username)) or ('email' in user and email and (user['email'] == email))):
                self.keycloak_admin.delete_user(user['id'])
                user_deleted = True
        return user_deleted

    def create_update_client_role(self, client_name, name, description=None):
        client_id = self.keycloak_admin.get_client_id(client_name)
        roles = self.keycloak_admin.get_client_roles(client_id)
        role_changed = False
        add_role = True
        role_payload = {'description': description,
                        'name': name, 'clientRole': True}
        for role in roles:
            if role['name'] == name:
                add_role = False
                if (('description' in role and description == None) or ('description' not in role and description) or ('description' in role and role['description'] != description)):
                    self.del_client_role(client_name, name)
                    add_role = True
        if add_role:
            self.keycloak_admin.create_client_role(
                client_id, role_payload)
            role_changed = True
        return role_changed

    def del_client_role(self, client_name, name):
        client_role_id = self.keycloak_admin.get_client_id(client_name)
        roles = self.keycloak_admin.get_client_roles(client_role_id)
        role_changed = False
        for role in roles:
            if role['name'] == name:
                params_path = {"realm": self.realm_name, "role_id": role['id']}
                self.keycloak_admin.raw_delete(
                    'admin/realms/{realm}/roles-by-id/{role_id}'.format(**params_path))
                role_changed = True
        return role_changed

    def create_update_realm_role(self, role_name, description=None):
        roles = self.keycloak_admin.get_realm_roles()
        add_role = True
        role_changed = False
        role_payload = {'composite': True,
                        'description': description, 'name': role_name}
        for role in roles:
            if role['name'] == role_name:
                add_role = False
                if (('description' in role and description == None) or ('description' not in role and description) or ('description' in role and role['description'] != description)):
                    params_path = {"realm": self.realm_name, "id": role['id']}
                    response = self.keycloak_admin.raw_put(
                        'admin/realms/{realm}/roles-by-id/{id}'.format(**params_path), data=json.dumps(role_payload))
                    if response.status_code == 204:
                        role_changed = True
        if add_role:
            self.keycloak_admin.create_realm_role(role_payload)
            role_changed = True
        return role_changed

    def del_realm_role(self, name):
        roles = self.keycloak_admin.get_realm_roles()
        role_changed = False
        for role in roles:
            if role['name'] == name:
                self.keycloak_admin.delete_realm_role(name)
                role_changed = True
        return role_changed

    def koppel_rol_user(self, client_name, role_names, username):
        client_id = self.keycloak_admin.get_client_id(client_name)
        user_id = self.keycloak_admin.get_user_id(username)
        # dit kan dus een lijst worden
        client_roles = self.keycloak_admin.get_client_roles(client_id)
        user_client_roles = [user_role['name'] for user_role in self.keycloak_admin.get_client_roles_of_user(user_id, client_id)]

        # dit kan dus een lijst worden, because name can contain slashes which the default keycloak restapi doesn't support very well
        list_roles = []
        for client_role in client_roles:
            #Check if the user doesn't already have the role
            if(client_role['name'] in role_names and client_role['name'] not in user_client_roles):
                list_roles.append(client_role)

        if len(list_roles) > 0:
            # Assign client role to user. Note that BOTH role_name and role_id appear to be required.
            self.keycloak_admin.assign_client_role(
                client_id=client_id, user_id=user_id, roles=list_roles)
            return True
        return False

    def get_realm_role_id(self, realm_role_name):
        realm_roles = self.keycloak_admin.get_realm_roles()
        for realm_role in realm_roles:
            if realm_role['name'] == realm_role_name:
                return realm_role['id']
                # Loop through all roles, mainly because slashes again. If the correct role is found by name. Get the ID of the role

    def get_roles_of_clients(self, client_id, role_name):
        client_roles = self.keycloak_admin.get_client_roles(client_id)
        # dit kan dus een lijst worden, because name can contain slashes which the default keycloak restapi doesn't support very well
        list_roles = []
        for client_role in client_roles:
            if(client_role['name'] == role_name):
                list_roles.append(client_role)
        return list_roles

    def add_role_realm_client(self, realm_role_name, client_name, role_name):
        # role_name moet gelijk zijn!
        client_id = self.keycloak_admin.get_client_id(client_name)

        list_roles = self.get_roles_of_clients(client_id , role_name)

        role_id = self.get_realm_role_id(realm_role_name)

        params_path = {"realm": self.realm_name, "role_id": role_id}
        for role in list_roles:
            if self.is_client_role_connected(role_id, client_id, role_name):
                return False
            composite_role_payload = self.get_composite_payload(client_id, role['id'], role['name'])

            post_response = self.keycloak_admin.raw_post(
                "admin/realms/{realm}/roles-by-id/{role_id}/composites".format(**params_path), data=json.dumps(composite_role_payload))
            if post_response.status_code == 204:
                return True
        return False


    def seperate_role_realm_client(self, realm_role_name, client_name, role_name):
        # role_name moet gelijk zijn!
        client_id = self.keycloak_admin.get_client_id(client_name)

        list_roles = self.get_roles_of_clients(client_id , role_name)

        role_id = self.get_realm_role_id(realm_role_name)

        params_path = {"realm": self.realm_name, "role_id": role_id}
        for role in list_roles:
            if not self.is_client_role_connected(role_id, client_id, role_name):
                return False

            composite_role_payload = self.get_composite_payload(client_id, role['id'], role['name'])

            post_response = self.keycloak_admin.raw_delete(
                "admin/realms/{realm}/roles-by-id/{role_id}/composites".format(**params_path), data=json.dumps(composite_role_payload))
            if post_response.status_code == 204:
                return True
        return False

    def get_composite_payload(self, container_id, role_id, role_name, client_role = True, compose = False):
        # This part is used by the keycloak frontend to create composite roles.
        return [{
                'clientRole': client_role,
                'composite': compose,
                # The id of the client where the role is in
                'containerId': container_id,
                'id': role_id,  # The id of the client role
                # The name of the client role
                'name': role_name
            }]

    def is_client_role_connected(self, role_id, client_id, role_name):
        params_path = {"realm": self.realm_name,
                       "role_id": role_id, "client_id": client_id}
        compose_response = self.keycloak_admin.raw_get(
            "admin/realms/{realm}/roles-by-id/{role_id}/composites/clients/{client_id}".format(**params_path))
        composite_roles = json.loads(compose_response.text)
        for composite_role in composite_roles:
            if composite_role['name'] == role_name:
                return True
        return False

    def create_update_realm(self, payload):
        # controle op changed is er nog niet
        realms = self.keycloak_admin.get_realms()
        add_realm = True
        changed = False
        for realm in realms:
            if realm['realm'] == payload['realm']:
                # Check if there are changes in the payload if not then return with no changes
                changed = self.compare(payload, realm)
                add_realm = False
                if changed:
                    self.keycloak_admin.update_realm(payload['realm'], payload)
        if add_realm:
            self.keycloak_admin.create_realm(payload)
            changed = True
        return changed

    def create_update_client(self, payload):
        clients = self.keycloak_admin.get_clients()
        add_client = True
        changed = False
        for client in clients:
            if client['clientId'] == payload['clientId']:
                # Check if there are changes in the payload if not then return with no changes
                changed = self.compare(payload, client)
                add_client = False
                if changed:
                    self.keycloak_admin.update_client(client['id'], payload)
        if add_client:
            self.keycloak_admin.create_client(payload)
            changed = True
        return changed

    def del_identityProvider(self, alias):
        identityProviders = self.keycloak_admin.get_idps()
        for identityProviders in identityProviders:
            if identityProviders['alias'] == alias:
                identityProviders = self.keycloak_admin.delete_idp(alias)
                return True
        return False

    def create_update_identityProvider(self, payload):
        identityProviders = self.keycloak_admin.get_idps()
        for identityProviders in identityProviders:
            if identityProviders['alias'] == payload['alias']:
                return self.update_identity_provider(identityProviders['alias'], payload)
        self.keycloak_admin.create_idp(payload)
        return True

    def compare(self, new_object, existing_object):
        for key in new_object:
            if key not in existing_object:
                return True
            elif type(new_object[key]) is dict:
                subTypeChanged = self.compare(new_object[key], existing_object[key])
                if subTypeChanged:
                    return True
            elif type(new_object[key]) is bool or new_object[key] == 'true' or new_object[key] == 'false':
                if str(new_object[key]).upper() != str(existing_object[key]).upper():
                    return True
            elif(new_object[key] != existing_object[key]):
                return True
        return False

    def update_identity_provider(self, alias, payload):
        params_path = {"realm": self.realm_name, "alias": alias}
        current_idp = self.keycloak_admin.raw_get(
            'admin/realms/{realm}/identity-provider/instances/{alias}'.format(**params_path))
        changed = False
        if current_idp.status_code == 200:
            idp = json.loads(current_idp.text)

            changed = self.compare(payload, idp)

            if changed:
                self.keycloak_admin.raw_put(
                    'admin/realms/{realm}/identity-provider/instances/{alias}'.format(**params_path), data=json.dumps(payload))
        return changed

    def create_update_identityProvider_mapper(self, idp_alias, payload):
        identityProviders = self.keycloak_admin.get_idps()
        for identityProviders in identityProviders:
            if identityProviders['alias'] == idp_alias:
                for mapper in self.get_identityProvider_mappers(idp_alias):
                    if mapper['name'] == payload['name']:
                        id = mapper['id']
                        return self.update_identityProvider_mapper(idp_alias, id, payload)
                self.keycloak_admin.add_mapper_to_idp(idp_alias, payload)
                return True
        return False

    def get_identityProvider_mappers(self, alias):
        params_path = {"realm": self.realm_name, "alias": alias}
        data_raw = self.keycloak_admin.raw_get(
            'admin/realms/{realm}/identity-provider/instances/{alias}/mappers'.format(**params_path))

        if data_raw.status_code == 200:
            mappers = json.loads(data_raw.text)
            return mappers
        return []

    def update_identityProvider_mapper(self, alias, id, payload):
        params_path = {"realm": self.realm_name, "alias": alias, 'id': id}
        data_raw = self.keycloak_admin.raw_put(
            'admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}'.format(**params_path), data=json.dumps(payload))

        if data_raw.status_code == 204:
            return True
        return False

    def del_identityProvider_mapper(self, alias, name):
        mappers = self.get_identityProvider_mappers(alias)
        for map in mappers:
            if map['name'] == name:
                params_path = {"realm": self.realm_name,
                               "alias": alias, "id": map['id']}
                self.keycloak_admin.raw_delete(
                    'admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}'.format(**params_path))
                return True
        return False

    def del_realm(self, name):
        self.keycloak_admin.delete_realm(name)
        return True

    def del_client_roles_of_user(self, client_name, role_names, username):
        client_id = self.keycloak_admin.get_client_id(client_name)
        user_id = self.keycloak_admin.get_user_id(username)

        client_roles = self.keycloak_admin.get_client_roles(client_id)

        # dit kan dus een lijst worden, because name can contain slashes which the default keycloak restapi doesn't support very well
        list_roles = []
        for client_role in client_roles:
            if(client_role['name'] in role_names):
                list_roles.append(client_role)

        if(len(list_roles) > 0):
            self.keycloak_admin.delete_client_roles_of_user(
                user_id, client_id, list_roles)
            return True
        else:
            return False

    def create_update_client_scope(self, payload):
        client_scopes = self.keycloak_admin.get_client_scopes()
        changed = False
        for client_scope in client_scopes:
            if client_scope['name'] == payload['name']:
                changed = self.compare(payload, client_scope)
                if changed:
                    self.keycloak_admin.update_client_scope(client_scope['id'], payload)
                return changed
        self.keycloak_admin.create_client_scope(payload)
        changed = True
        return changed

    def add_protocol_mappers(self, client_scope_name, protocol_mappers):
        client_scopes = self.keycloak_admin.get_client_scopes()
        changed = False
        client_scope_protocolMappers = []
        for client_scope in client_scopes:
            if client_scope['name'] == client_scope_name:
                client_scope_id = client_scope['id']
                if 'protocolMappers' in client_scope:
                    client_scope_protocolMappers += client_scope['protocolMappers']

        for protocol_mapper in protocol_mappers:
            existing=False
            for client_protocol_mapper in client_scope_protocolMappers:
                if protocol_mapper['name'] == client_protocol_mapper['name']:
                    existing = True
                    changes = self.compare(protocol_mapper, client_protocol_mapper)
                    if changes:
                        self.keycloak_admin.delete_mapper_from_client_scope(client_scope_id, client_protocol_mapper['id'])
                        self.keycloak_admin.add_mapper_to_client_scope(client_scope_id, protocol_mapper)
                        changed = True
            if not existing:
                # add the mapper if it doesn't exist already
                self.keycloak_admin.add_mapper_to_client_scope(client_scope_id, protocol_mapper)
                changed = True
        return changed

    def del_client_scope(self, client_scope_name):
        client_scopes = self.keycloak_admin.get_client_scopes()
        changed = False
        for client_scope in client_scopes:
            if client_scope['name'] == client_scope_name:
                params_path = {"realm": self.realm_name, "client_scope_id": client_scope['id']}
                self.keycloak_admin.raw_delete('admin/realms/{realm}/client-scopes/{client_scope_id}'.format(**params_path))
                changed = True
        return changed

    def get_client_scope_id(self, client_scope_name):
        client_scopes = self.keycloak_admin.get_client_scopes()
        for client_scope in client_scopes:
            if client_scope['name'] == client_scope_name:
                return client_scope['id']

    def get_current_default_client_scopes(self, client_name):
        client_id = self.keycloak_admin.get_client_id(client_name)
        params_path = {"realm": self.realm_name, "client_id": client_id}
        client_scope_response = self.keycloak_admin.raw_get('admin/realms/{realm}/clients/{client_id}/default-client-scopes'.format(**params_path))
        client_scopes = json.loads(client_scope_response.text)
        return client_scopes

    def is_clientscope_present(self, client_name, client_scope_name):
        default_client_scopes = self.get_current_default_client_scopes(client_name)
        for default_client_scope in default_client_scopes:
            if default_client_scope['name'] == client_scope_name:
                return True
        return False

    def assign_client_scope(self, client_scope_name, client_name):
        client_id = self.keycloak_admin.get_client_id(client_name)
        client_scope_id = self.get_client_scope_id(client_scope_name)
        if client_id is not None and client_scope_id is not None and not self.is_clientscope_present(client_name, client_scope_name):
            params_path = {"realm": self.realm_name, "client_scope_id": client_scope_id, "client_id": client_id}
            self.keycloak_admin.raw_put('admin/realms/{realm}/clients/{client_id}/default-client-scopes/{client_scope_id}'.format(**params_path), data={})
            return True
        return False

    def unassign_client_scope(self, client_scope_name, client_name):
        client_id = self.keycloak_admin.get_client_id(client_name)
        client_scope_id = self.get_client_scope_id(client_scope_name)

        if client_id is not None and client_scope_id is not None and self.is_clientscope_present(client_name, client_scope_name):
            params_path = {"realm": self.realm_name, "client_scope_id": client_scope_id, "client_id": client_id}
            self.keycloak_admin.raw_delete('admin/realms/{realm}/clients/{client_id}/default-client-scopes/{client_scope_id}'.format(**params_path))
            return True
        return False


    def assign_realm_roles(self, username, role_names):
        user_id = self.keycloak_admin.get_user_id(username)

        changed = False

        params_path = {"realm": self.realm_name, "user_id": user_id }
        payloads = self.gather_composite_realm_role_payload(role_names)

        current_realm_ids = [realm_role['id'] for realm_role in self.keycloak_admin.get_realm_roles_of_user(user_id)]

        for payload in payloads:
            # Check if the user does't has the realm, otherwise continue
            if payload['id'] in current_realm_ids:
                continue
            # The data is added as array because thats what keycloak expects.
            response = self.keycloak_admin.raw_post('admin/realms/{realm}/users/{user_id}/role-mappings/realm'.format(**params_path), data=json.dumps([payload]))
            if response.status_code == 204:
                changed = True
        return changed

    def delete_realm_roles(self, username, role_names):
        user_id = self.keycloak_admin.get_user_id(username)

        changed = False

        params_path = {"realm": self.realm_name, "user_id": user_id }
        payloads = self.gather_composite_realm_role_payload(role_names)

        current_realm_ids = [realm_role['id'] for realm_role in self.keycloak_admin.get_realm_roles_of_user(user_id)]

        for payload in payloads:
            # Check if the user has the realm, otherwise continue
            if payload['id'] not in current_realm_ids:
                continue
            # The data is added as array because thats what keycloak expects.
            response = self.keycloak_admin.raw_delete('admin/realms/{realm}/users/{user_id}/role-mappings/realm'.format(**params_path), data=json.dumps([payload]))
            if response.status_code == 204:
                changed = True
        return changed

    def gather_composite_realm_role_payload(self, role_names):
        realm_roles = self.keycloak_admin.get_realm_roles()
        realms = self.keycloak_admin.get_realms()

        realm_id = None
        for realm in realms:
            if realm['realm'] == self.realm_name:
                realm_id = realm['id']

        new_realm_roles = []
        for realm_role in realm_roles:
            if realm_role['name'] in role_names:
                new_realm_roles.append({'name': realm_role['name'], 'id': realm_role['id']})

        payloads = []
        for new_realm_role in new_realm_roles:
            #Because get_composite_payload return a array with a single entry we need to combine the arrays instead of appending
            payloads += self.get_composite_payload(realm_id, new_realm_role['id'], new_realm_role['name'], False, True)

        return payloads

http_200 = False

auth_username = os.environ['KEYCLOAK_AUTH_USERNAME']
auth_password = os.environ['KEYCLOAK_AUTH_PASSWORD']
auth_keycloak_url = os.environ['KEYCLOAK_AUTH_KEYCLOAK_URL']
auth_client_root_url = os.environ['KEYCLOAK_CLIENT_ROOT_URL']
auth_client_secret = os.environ['KEYCLOAK_CLIENT_SECRET']
client_users = os.environ['KEYCLOAK_CLIENT_USERS']

# wait for keycloak to startup
print("Waiting for Keycloak to startup...")

while (http_200 == False):
    print("Try to connect to {0}".format(auth_keycloak_url))
    try:
        response = requests.get(auth_keycloak_url, timeout=5)
        if response.status_code == 200:
            http_200 = True
		    print("Keycloak is online. Running script now...")
        else:
            print("Error status_code:{0}, reason:{1}".format(response.status_code, response.reason))
    except:
        print("Timeout")


auth_realm = "master"
realm = "hhb"
auth_client_id = 'admin-cli'
keyCloakApi = KeyCloakApi(auth_username,auth_password,auth_realm,auth_keycloak_url,auth_client_id,realm,False)

# TODO Bruteforce protection aanzetten voor realm master
# TODO Bruteforce protection aanzetten voor realm hhb

payload_realm = {'enabled': True,'realm': realm}
payload_client = { 'redirectUris': [auth_client_root_url+'*'], 'clientId': 'hhb', 'rootUrl': auth_client_root_url, 'enabled': True, 'directAccessGrantsEnabled': True, 'standardFlowEnabled': True, 'clientAuthenticatorType': 'client-secret', 'secret': auth_client_secret }

keyCloakApi.create_update_realm(payload_realm)
keyCloakApi.create_update_client(payload_client)



users_strings = client_users.split(':')

keyCloakApi = KeyCloakApi(auth_username,auth_password,auth_realm,auth_keycloak_url,realm,realm,False)

for user_string in users_strings:
    user = user_string.split(',')
    keyCloakApi.create_update_user(user[0], user[1], True, user[2], user[3], user[4], False)

terraform {
  source = "..\\..\\tofu\\iam"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "keyvault" {
  config_path = "../keyvault"
}

dependency "aks" {
  config_path = "../aks"
}

inputs = {
  roles = [
    {
      object_id = include.locals.env.team_group_id
      role_name = "Key Vault Administrator"
      scope     = dependency.keyvault.outputs.id
    },
    {
      object_id = include.locals.env.team_group_id
      role_name = "Azure Kubernetes Service RBAC Admin"
      scope     = dependency.aks.outputs.id
    },
    {
      object_id = dependency.aks.outputs.principal_id
      role_name = "Network Contributor"
      scope     = dependency.aks.outputs.node_resource_group_id
    }
  ]
}
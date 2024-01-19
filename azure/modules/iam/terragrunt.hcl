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
      object_id = "d8cb810e-daa8-44f9-a606-f870f15e9e50"
      role_name = "Key Vault Administrator"
      scope     = dependency.keyvault.outputs.id
    },
    {
      object_id = "d8cb810e-daa8-44f9-a606-f870f15e9e50"
      role_name = "Azure Kubernetes Service RBAC Admin"
      scope     = dependency.aks.outputs.id
    }
  ]
}
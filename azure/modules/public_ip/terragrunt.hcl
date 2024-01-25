terraform {
  source = "..\\..\\tofu\\public_ip"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "aks" {
  config_path = "../aks"
}

inputs = {
  location            = include.locals.globals.location
  name                = "pip-ingress-nginx"
  resource_group_name = dependency.aks.outputs.node_resource_group
  sku                 = "Standard"
}
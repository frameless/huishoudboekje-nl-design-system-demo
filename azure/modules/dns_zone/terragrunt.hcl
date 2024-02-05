terraform {
  source = "..\\..\\tofu\\dns_zone"
}

include {
  path   = find_in_parent_folders()
  expose = true
}


dependency "aks" {
  config_path = "../aks"
}

inputs = {
  name                = "hhb-development.nl"
  resource_group_name = dependency.aks.outputs.node_resource_group
}
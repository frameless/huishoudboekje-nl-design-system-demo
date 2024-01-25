terraform {
  source = "..\\..\\tofu\\nginx-ingress-controller"
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

dependency "public_ip" {
  config_path = "../public_ip"
}

inputs = {
  admin_client_certificate    = dependency.aks.outputs.admin_client_certificate
  admin_client_key            = dependency.aks.outputs.admin_client_key
  admin_client_ca_certificate = dependency.aks.outputs.admin_cluster_ca_certificate
  admin_client_host           = dependency.aks.outputs.admin_host
  k8s_namespace_name          = "ingress-basic"
  public_ip                   = dependency.public_ip.outputs.ip_address
}
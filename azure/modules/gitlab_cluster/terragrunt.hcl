terraform {
  source = "..\\..\\tofu\\gitlab_cluster_agent"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "aks" {
  config_path = "../aks"
}


inputs = {
  admin_client_certificate    = dependency.aks.outputs.admin_client_certificate
  admin_client_key            = dependency.aks.outputs.admin_client_key
  admin_client_ca_certificate = dependency.aks.outputs.admin_cluster_ca_certificate
  admin_client_host           = dependency.aks.outputs.admin_host
  gitlab_token                = include.locals.env.gitlab_token
  gitlab_namespace            = "commonground/huishoudboekje/app-new"
}
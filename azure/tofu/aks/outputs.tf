output "client_certificate" {
  value     = azurerm_kubernetes_cluster.k8s.kube_config.0.client_certificate
  sensitive = true
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.k8s.kube_config_raw
  sensitive = true
}

output "id" {
  value = azurerm_kubernetes_cluster.k8s.id
}

output "principal_id" {
  value = azurerm_kubernetes_cluster.k8s.identity[0].principal_id
}

output "admin_client_certificate" {
  description = "The `client_certificate` in the `azurerm_kubernetes_cluster`'s `kube_admin_config` block.  Base64 encoded public certificate used by clients to authenticate to the Kubernetes cluster."
  sensitive   = true
  value       = try(azurerm_kubernetes_cluster.k8s.kube_admin_config[0].client_certificate, "")
}

output "admin_client_key" {
  description = "The `client_key` in the `azurerm_kubernetes_cluster`'s `kube_admin_config` block. Base64 encoded private key used by clients to authenticate to the Kubernetes cluster."
  sensitive   = true
  value       = try(azurerm_kubernetes_cluster.k8s.kube_admin_config[0].client_key, "")
}

output "admin_cluster_ca_certificate" {
  description = "The `cluster_ca_certificate` in the `azurerm_kubernetes_cluster`'s `kube_admin_config` block. Base64 encoded public CA certificate used as the root of trust for the Kubernetes cluster."
  sensitive   = true
  value       = try(azurerm_kubernetes_cluster.k8s.kube_admin_config[0].cluster_ca_certificate, "")
}

output "admin_host" {
  description = "The `host` in the `azurerm_kubernetes_cluster`'s `kube_admin_config` block. The Kubernetes cluster server host."
  sensitive   = true
  value       = try(azurerm_kubernetes_cluster.k8s.kube_admin_config[0].host, "")
}

output "node_resource_group" {
    description = "The resource group created by the AKS for it's resources"
    value = azurerm_kubernetes_cluster.k8s.node_resource_group
}

output "node_resource_group_id" {
    description = "The id for the resource group created by the AKS for it's resources"
    value = azurerm_kubernetes_cluster.k8s.node_resource_group_id
}

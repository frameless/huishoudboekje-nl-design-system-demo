kubectl patch pvc hhb-database-volumeclaim -p '{"metadata":{"finalizers": []}}' --type=merge --namespace=$NAMESPACE
kubectl patch pv hhb-database-volume -p '{"metadata":{"finalizers": []}}' --type=merge --namespace=$NAMESPACE
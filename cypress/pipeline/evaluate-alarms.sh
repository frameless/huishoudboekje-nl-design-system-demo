JOB_NAME="e2e-test-evaluate-alarms-job-$(date +'%Y%m%d%H%M%S')"
kubectl create job --from=cronjob/evaluate-alarms "${JOB_NAME}" --namespace=$NAMESPACE
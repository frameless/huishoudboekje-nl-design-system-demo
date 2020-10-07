{{/*
Expand the name of the chart.
*/}}
{{- define "medewerker-backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Expand the tag for the container image.
*/}}
{{- define "medewerker-backend.imageTag" -}}
{{- .Values.image.tag | default .Values.global.imageTag | default .Chart.AppVersion -}}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "medewerker-backend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "medewerker-backend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "medewerker-backend.labels" -}}
helm.sh/chart: {{ include "medewerker-backend.chart" . }}
{{ include "medewerker-backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "medewerker-backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "medewerker-backend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "medewerker-backend.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "medewerker-backend.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "medewerker-backend.huishoudboekjeServiceName" -}}
{{- if .Values.serviceChartPrefix -}}
{{ printf "%s-" .Values.serviceChartPrefix -}}
{{- end -}}
huishoudboekje-service.{{ .Release.Namespace }}.svc.cluster.local
{{- end }}

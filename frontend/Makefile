PROJECT_ID=rebas-tw
CLOUD_RUN_SERVICE=baseball-record-live
CLOUD_RUN_REGION=asia-east1
IMAGE_NAME=baseball-record-live

deploy:
	docker build -t asia.gcr.io/${PROJECT_ID}/${IMAGE_NAME} ./
	docker push asia.gcr.io/${PROJECT_ID}/${IMAGE_NAME}
	# gcloud run deploy ${CLOUD_RUN_SERVICE} \
	# 	--image asia.gcr.io/${PROJECT_ID}/${IMAGE_NAME} \
	# 	--project ${PROJECT_ID} \
	# 	--region $(CLOUD_RUN_REGION) \
	# 	--platform managed \
	# 	--allow-unauthenticated

PROJECT_ID=rebas-tw
CLOUD_RUN_SERVICE=stream-rebas-tw
CLOUD_RUN_REGION=asia-east1
IMAGE_NAME=stream.rebas.tw
SECRET_KEY_PATH=../rebas-secretkey

all:
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env
	cd backend; yarn install
	cd frontend; yarn install

deploy: pre-deploy do-deploy

pre-deploy:
	cd ${SECRET_KEY_PATH}; git pull --rebase
	cp ${SECRET_KEY_PATH}/${IMAGE_NAME}/backend.env backend.env
	cp ${SECRET_KEY_PATH}/${IMAGE_NAME}/frontend.env frontend.env

do-deploy:
	docker build -t asia.gcr.io/${PROJECT_ID}/${IMAGE_NAME} \
		--build-arg BACKEND_ENV_FILE=backend.env \
		--build-arg FRONTEND_ENV_FILE=frontend.env \
		./
	docker push asia.gcr.io/${PROJECT_ID}/${IMAGE_NAME}
	gcloud run deploy ${CLOUD_RUN_SERVICE} \
		--image asia.gcr.io/${PROJECT_ID}/${IMAGE_NAME} \
		--project ${PROJECT_ID} \
		--region $(CLOUD_RUN_REGION) \
		--platform managed \
		--allow-unauthenticated

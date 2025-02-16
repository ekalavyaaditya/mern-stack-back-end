pipeline {
    agent any
    
    environment {
        IMAGE_NAME = "jenkinsback-end"
        DOCKERFILE = "Dockerfile.dev"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME} -f ${DOCKERFILE} ."
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh "docker run ${IMAGE_NAME} npm test -- --coverage"
                }
            }
        }
    }
}

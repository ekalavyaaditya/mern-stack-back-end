pipeline {
    agent any

    environment {
        IMAGE_NAME = 'jenkinsback-end'
        DOCKERFILE = 'Dockerfile.dev'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME} -f ${DOCKERFILE} ."
                }
            }
        }
        stage('Decrypt Environment Variables') {
            steps {
                sh 'openssl enc -aes256 -d -in .enc -out .env -k $SECRET_KEY'
                sh 'openssl enc -aes256 -d -in serviceAccount.json.enc -out serviceAccount.json -k $SERVICE_KEY'
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

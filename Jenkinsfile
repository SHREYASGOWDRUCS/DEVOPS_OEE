pipeline {
    agent any

    parameters {
        choice(
            name: 'TRAFFIC',
            choices: ['LOW', 'HIGH'],
            description: 'Select traffic level'
        )
    }

    environment {
        IMAGE_NAME = "student-portal:v1"
    }

    stages {

        stage('Clone Code') {
            steps {
                git 'YOUR_GITHUB_REPO_URL'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Select Deployment Strategy') {
            steps {
                script {
                    if (params.TRAFFIC == "HIGH") {
                        env.STRATEGY = "blue-green"
                    } else {
                        env.STRATEGY = "rolling"
                    }

                    echo "Selected Strategy: ${env.STRATEGY}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (env.STRATEGY == "rolling") {
                        sh 'kubectl apply -f rolling.yaml'
                    } else {
                        sh 'kubectl apply -f blue-green.yaml'
                    }
                }
            }
        }
    }
}
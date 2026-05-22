pipeline {
    agent any

    parameters {
        choice(
            name: 'TRAFFIC',
            choices: ['LOW', 'HIGH'],
            description: 'Traffic level'
        )
    }

    environment {
        IMAGE_NAME = "student-portal:v2"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                echo "Building Docker Image"
            }
        }

        stage('Select Deployment Strategy') {
            steps {
                script {

                    if (params.TRAFFIC == "HIGH") {
                        env.STRATEGY = "blue-green"
                    }

                    else {
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

                bat 'kubectl apply -f rolling.yaml --validate=false'

                 } else {

                    bat 'kubectl apply -f blue-green.yaml --validate=false'
                }
        }
    }
}
    }
}
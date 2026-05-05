pipeline {
    agent any
    tools{
        nodejs 'Node'
    }
    stages{

        stage("Build Application"){
            steps{
                script{
                    echo "Building the Application"
                    sh 'cd frontend && npm install'
                }
            }
        }
        stage("Building Image"){
            steps{
                script{
                    echo "Building the image of the application"
                    withCredentials([usernamePassword(credentialsId: 'DockerHub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS' )])
                    {
                      sh "cd frontend && docker build -t dharmakhadka/dockerinjenkins:1.1 ."
                      sh "echo $PASS | docker login -u $USER --password-stdin"
                      sh "docker push dharmakhadka/dockerinjenkins:1.1"
                    }  
                }
            }
        }
        stage("Deploy"){
            steps{
                echo "Deploying the Application"
            }
        }
    }
}

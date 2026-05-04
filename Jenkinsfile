pipeline {
    agent any
    parameters{
        choice (name: 'Version', choices: ['1.0','1.1','1.2'], description: 'Select Versions')
        booleanParam (name: 'ExecuteTests', defaultValue: true, description: '')
    }
    stages{

        stage("Build"){
            steps{
                echo "Building Application"
            }
        }
        stage("Test"){
            steps{
                echo "Testing Application"
            }
        }
        stage("Deploy"){
            steps{
                echo "Deploying Application"
            }
        }
    }
}

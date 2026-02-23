pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'frontend'
        NODE_ENV = 'production'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // timestamps()  <-- se quita para evitar error
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
            }
        }

        stage('Clean Workspace') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        if [ -d node_modules ]; then
                            chmod -R u+w node_modules
                            rm -rf node_modules
                        fi
                        rm -f package-lock.json
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { return env.SONARQUBE_ENABLED == 'true' }
            }
            steps {
                dir("${FRONTEND_DIR}") {
                    withSonarQubeEnv('SonarQube') {
                        sh 'sonar-scanner'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finalizado"
        }
        success {
            echo "Pipeline completado ✅"
        }
        failure {
            echo "Pipeline falló ❌"
        }
    }
}

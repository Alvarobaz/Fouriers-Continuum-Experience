pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'frontend' // Ajusta al path de tu proyecto Angular
        NODE_ENV = 'production'
    }

    options {
        // Limita logs y asegura limpieza de workspace entre builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
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
                echo 'Limpiando workspace y node_modules...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Eliminando node_modules y package-lock.json con permisos correctos..."
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
                echo 'Instalando dependencias npm...'
                dir("${FRONTEND_DIR}") {
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Build Angular') {
            steps {
                echo 'Compilando Angular para producción...'
                dir("${FRONTEND_DIR}") {
                    sh 'npm run build -- --configuration production'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Ejecutando tests...'
                dir("${FRONTEND_DIR}") {
                    sh 'npm run test -- --watch=false --browsers=ChromeHeadless'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Ejecutando análisis SonarQube...'
                withSonarQubeEnv('SonarQubeServer') { // Ajusta el nombre de tu servidor Sonar
                    dir("${FRONTEND_DIR}") {
                        sh 'sonar-scanner'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
        always {
            echo 'Limpiando workspace después del build...'
            cleanWs()
        }
    }
}

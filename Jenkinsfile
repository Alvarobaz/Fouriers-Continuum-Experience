pipeline {
    agent any

    tools {
        nodejs 'node16'
    }

    environment {
        VERSION = "${BUILD_NUMBER}"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        /* ================= FRONTEND ================= */

        stage('Build Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                        echo "📦 Instalando dependencias..."
                        npm ci --legacy-peer-deps

                        echo "🏗️ Build Angular..."
                        npm run build
                    '''
                }
            }
        }

        stage('Package Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                        echo "📦 Creando ZIP..."

                        rm -f angular-${VERSION}.zip

                        npx bestzip angular-${VERSION}.zip dist
                    '''
                }
            }
        }

        stage('Publish Angular to Nexus') {
            steps {
                dir('Front-End') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh '''
                            echo "🚀 Subiendo frontend a Nexus..."

                            curl -u $NEXUS_USER:$NEXUS_PASS \
                              --upload-file angular-${VERSION}.zip \
                              http://nexus:8081/repository/angular/angular-${VERSION}.zip
                        '''
                    }
                }
            }
        }

        /* ================= BACKEND ================= */

        stage('Build Backend') {
            steps {
                dir('Back-End') {
                    sh '''
                        echo "☕ Build backend..."
                        ./mvnw clean package -DskipTests
                    '''
                }
            }
        }

        stage('Publish Backend') {
            steps {
                dir('Back-End') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh '''
                            echo "🚀 Subiendo backend..."

                            FILE=$(ls target/*.jar | head -n 1)

                            curl -u $NEXUS_USER:$NEXUS_PASS \
                              --upload-file $FILE \
                              http://nexus:8081/repository/backend/backend-${VERSION}.jar
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ DEPLOY COMPLETADO'
        }
        failure {
            echo '❌ FALLÓ EL DEPLOY'
        }
    }
}

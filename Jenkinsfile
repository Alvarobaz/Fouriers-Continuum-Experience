pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        jdk 'JDK17'
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

        /* ==========================
           FRONTEND BUILD
        ========================== */

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

        /* ==========================
           ZIP FRONTEND (FIX FINAL)
        ========================== */

        stage('Package Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                        echo "📦 Creando ZIP del frontend..."

                        rm -f angular-${VERSION}.zip

                        npx bestzip angular-${VERSION}.zip dist
                    '''
                }
            }
        }

        /* ==========================
           SUBIR A NEXUS
        ========================== */

        stage('Publish Angular to Nexus') {
            steps {
                dir('Front-End') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh '''
                            echo "🚀 Subiendo artefacto a Nexus..."

                            curl -v -u $NEXUS_USER:$NEXUS_PASS \
                              --upload-file angular-${VERSION}.zip \
                              http://nexus:8081/repository/angular/angular-${VERSION}.zip
                        '''
                    }
                }
            }
        }

        /* ==========================
           BACKEND BUILD
        ========================== */

        stage('Build Backend') {
            steps {
                dir('Back-End') {
                    sh '''
                        echo "☕ Compilando backend..."
                        ./mvnw clean package -DskipTests
                    '''
                }
            }
        }

        stage('Publish Backend to Nexus') {
            steps {
                dir('Back-End') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh '''
                            echo "🚀 Subiendo backend a Nexus..."

                            curl -v -u $NEXUS_USER:$NEXUS_PASS \
                              --upload-file target/*.jar \
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

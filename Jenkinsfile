pipeline {
    agent any

    environment {
        // Nexus
        NEXUS_URL = "http://localhost:8081"
        NEXUS_DOCKER = "localhost:5000"
        NEXUS_REPO_MAVEN = "maven-releases"
        NEXUS_REPO_NPM = "npm-releases"

        // Imagenes
        BACKEND_IMAGE = "fce-backend"
        FRONTEND_IMAGE = "fce-frontend"

        VERSION = "${BUILD_NUMBER}"
    }

    stages {

        // =========================
        // CHECKOUT
        // =========================
        stage('Checkout') {
            steps {
                git 'https://github.com/Alvarobaz/Fouriers-Continuum-Experience'
            }
        }

        // =========================
        // BUILD BACKEND
        // =========================
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        // =========================
        // PUBLICAR BACKEND A NEXUS
        // =========================
        stage('Publish Backend to Nexus') {
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh """
                        mvn deploy -DskipTests \
                        -Dnexus.username=$NEXUS_USER \
                        -Dnexus.password=$NEXUS_PASS
                        """
                    }
                }
            }
        }

        // =========================
        // BUILD ANGULAR
        // =========================
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    npm install
                    npm run build -- --configuration production
                    '''
                }
            }
        }

        // =========================
        // PUBLICAR ANGULAR EN NEXUS (NPM)
        // =========================
        stage('Publish Frontend to Nexus') {
            steps {
                dir('frontend') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh """
                        npm config set registry $NEXUS_URL/repository/$NEXUS_REPO_NPM/
                        npm config set //$NEXUS_URL/repository/$NEXUS_REPO_NPM/:username=$NEXUS_USER
                        npm config set //$NEXUS_URL/repository/$NEXUS_REPO_NPM/:_password=$(echo -n $NEXUS_PASS | base64)
                        npm config set //$NEXUS_URL/repository/$NEXUS_REPO_NPM/:email=fake@email.com
                        npm publish --registry $NEXUS_URL/repository/$NEXUS_REPO_NPM/
                        """
                    }
                }
            }
        }

        // ==================================================
        // DESCARGAR ARTEFACTOS DESDE NEXUS (REPRODUCIBLE)
        // ==================================================
        stage('Download artifacts from Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-cred',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {

                    sh """
                    mkdir artifacts

                    # Backend JAR desde Nexus
                    curl -u $NEXUS_USER:$NEXUS_PASS \
                    -o artifacts/backend.jar \
                    $NEXUS_URL/repository/$NEXUS_REPO_MAVEN/com/fce/backend/${VERSION}/backend-${VERSION}.jar

                    # Frontend build (ejemplo empaquetado)
                    cp -r frontend/dist artifacts/frontend
                    """
                }
            }
        }

        // =========================
        // BUILD DOCKER BACKEND
        // =========================
        stage('Build Backend Docker Image') {
            steps {
                sh """
                docker build \
                -t $NEXUS_DOCKER/$BACKEND_IMAGE:$VERSION \
                -f deployment/docker/backend/Dockerfile \
                .
                """
            }
        }

        // =========================
        // BUILD DOCKER FRONTEND
        // =========================
        stage('Build Frontend Docker Image') {
            steps {
                sh """
                docker build \
                -t $NEXUS_DOCKER/$FRONTEND_IMAGE:$VERSION \
                -f deployment/docker/frontend/Dockerfile \
                .
                """
            }
        }

        // =========================
        // LOGIN DOCKER NEXUS
        // =========================
        stage('Docker Login Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-cred',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {

                    sh """
                    docker login $NEXUS_DOCKER \
                    -u $NEXUS_USER \
                    -p $NEXUS_PASS
                    """
                }
            }
        }

        // =========================
        // PUSH IMAGES
        // =========================
        stage('Push Docker Images to Nexus') {
            steps {
                sh """
                docker push $NEXUS_DOCKER/$BACKEND_IMAGE:$VERSION
                docker push $NEXUS_DOCKER/$FRONTEND_IMAGE:$VERSION
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline COMPLETO OK — artefactos + imágenes en Nexus"
        }
        failure {
            echo "❌ Pipeline falló"
        }
    }
}

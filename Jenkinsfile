pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node16'
    }

    environment {
        // Nexus URLs accesibles desde Jenkins
        NEXUS_URL = "http://nexus:8081"
        NEXUS_DOCKER = "nexus:5000"
        NEXUS_REPO_MAVEN = "maven-releases"
        NEXUS_REPO_RAW_ANGULAR = "raw-angular-dist"

        // Docker images
        BACKEND_IMAGE = "fce-backend"
        FRONTEND_IMAGE = "fce-frontend"

        VERSION = "${BUILD_NUMBER}"
    }

    stages {

        // =====================
        // CLEAN WORKSPACE
        // =====================
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        // =====================
        // CHECKOUT MAIN
        // =====================
        stage('Checkout SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/Alvarobaz/Fouriers-Continuum-Experience'
            }
        }

        // =====================
        // FRONTEND
        // =====================
        stage('Build Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                        echo "📦 Instalando dependencias..."
                        npm ci --legacy-peer-deps

                        echo "🏗️ Build Angular..."
                        npm run build -- --configuration production
                    '''
                }
            }
        }

        stage('Package Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                        echo "📦 Creando ZIP..."
                        rm -f angular-${BUILD_NUMBER}.zip
                        npx bestzip angular-${BUILD_NUMBER}.zip dist
                    '''
                }
            }
        }

        stage('Publish Angular to Nexus') {
            steps {
                dir('Front-End') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {
                        sh '''
                            echo "🚀 Subiendo Angular a Nexus RAW..."
                            curl -u $NEXUS_USER:$NEXUS_PASS \
                              --upload-file angular-${BUILD_NUMBER}.zip \
                              $NEXUS_URL/repository/$NEXUS_REPO_RAW_ANGULAR/angular-${BUILD_NUMBER}.zip
                        '''
                    }
                }
            }
        }

        // =====================
        // BACKEND
        // =====================
        stage('Build Backend') {
            steps {
                dir('Back-End') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Publish Backend to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-cred',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh '''
                        mkdir -p ~/.m2
                        cat > ~/.m2/settings.xml <<EOF
<settings>
    <servers>
        <server>
            <id>nexus</id>
            <username>${NEXUS_USER}</username>
            <password>${NEXUS_PASS}</password>
        </server>
    </servers>
</settings>
EOF
                    '''
                    dir('Back-End') {
                        sh '''
                            echo "🚀 Deployando backend a Nexus..."
                            mvn deploy:deploy-file \
                              -DrepositoryId=nexus \
                              -Durl=$NEXUS_URL/repository/$NEXUS_REPO_MAVEN/ \
                              -Dfile=target/issuetracking-0.0.1-SNAPSHOT.jar \
                              -DgroupId=com.mycompany.issuetracking \
                              -DartifactId=issuetracking \
                              -Dversion=1.0.${BUILD_NUMBER} \
                              -Dpackaging=jar \
                              -DgeneratePom=true
                        '''
                    }
                }
            }
        }

        // =====================
        // DESCARGAR ARTEFACTOS DESDE NEXUS
        // =====================
        stage('Download artifacts from Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-cred',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh '''
                        mkdir -p artifacts

                        echo "📥 Descargando backend JAR desde Nexus..."
                        curl -u $NEXUS_USER:$NEXUS_PASS -L \
                          -o artifacts/backend.jar \
                          $NEXUS_URL/repository/$NEXUS_REPO_MAVEN/com/mycompany/issuetracking/1.0.${BUILD_NUMBER}/issuetracking-1.0.${BUILD_NUMBER}.jar

                        echo "📥 Copiando frontend build..."
                        cp -r Front-End/dist artifacts/frontend
                    '''
                }
            }
        }

        // =====================
        // BUILD DOCKER IMAGES
        // =====================
        stage('Build Backend Docker Image') {
            steps {
                sh '''
                    echo "🐳 Construyendo imagen backend..."
                    docker build \
                        -t $NEXUS_DOCKER/$BACKEND_IMAGE:$VERSION \
                        -f deployment/docker/backend/Dockerfile \
                        .
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                    echo "🐳 Construyendo imagen frontend..."
                    docker build \
                        -t $NEXUS_DOCKER/$FRONTEND_IMAGE:$VERSION \
                        -f deployment/docker/frontend/Dockerfile \
                        .
                '''
            }
        }

        // =====================
        // DOCKER LOGIN
        // =====================
        stage('Docker Login Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-cred',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh '''
                        echo "🔐 Logueando en Nexus Docker..."
                        docker login $NEXUS_DOCKER \
                          -u $NEXUS_USER \
                          -p $NEXUS_PASS
                    '''
                }
            }
        }

        // =====================
        // PUSH DOCKER IMAGES
        // =====================
        stage('Push Docker Images to Nexus') {
            steps {
                sh '''
                    echo "🚀 Pusheando backend..."
                    docker push $NEXUS_DOCKER/$BACKEND_IMAGE:$VERSION

                    echo "🚀 Pusheando frontend..."
                    docker push $NEXUS_DOCKER/$FRONTEND_IMAGE:$VERSION
                '''
            }
        }

    }

    post {
        success {
            echo '✅ PIPELINE COMPLETO: Artefactos y Docker OK'
        }
        failure {
            echo '❌ PIPELINE FALLÓ'
        }
    }
}

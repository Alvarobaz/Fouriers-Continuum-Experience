pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        // Node.js si lo necesitaras más adelante: nodejs 'node22'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🔹 Limpiando workspace"
                deleteDir()
            }
        }

        stage('Checkout SCM') {
            steps {
                echo "🔹 Haciendo checkout del repositorio GitHub"
                checkout scm
            }
        }

        stage('Preparación de Entorno') {
            steps {
                echo "🔹 Herramientas configuradas: Maven y SonarScanner"
                sh 'mvn -v'
                sh 'sonar-scanner -v || echo "⚠️ SonarScanner no instalado o no configurado aún"'
            }
        }

        stage('Prueba de Pipeline') {
            steps {
                echo "🔹 Pipeline base funcionando correctamente"
            }
        }

        // Aquí se pueden añadir luego las etapas de Docker, Nexus, despliegue, etc.
    }

    post {
        always {
            echo "✅ Pipeline ejecutado (estado real según stages)"
        }
    }
}

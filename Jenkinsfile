pipeline {
    agent any

    tools {
        // Solo Maven por si se necesita para futuros stages, pero no se ejecuta
        maven 'Maven 3.8.8'
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
                echo "🔹 Herramientas listas (Maven configurado, SonarScanner disponible)"
            }
        }

        stage('Prueba de Pipeline') {
            steps {
                echo "🔹 Pipeline base funcionando correctamente"
            }
        }
    }

    post {
        always {
            echo "🔹 Pipeline finalizado"
        }
    }
}

#!groovy
properties([
    pipelineTriggers([
        pollSCM('H/5 * * * *')
    ])
])
pipeline {
  agent any
  stages{
    stage('Get Code') {
      steps {
          deleteDir()
          checkout ([
              $class: 'GitSCM',
              branches: scm.branches,
              doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
              extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
              userRemoteConfigs: scm.userRemoteConfigs,
           ])
           script {
               tag=sh(returnStdout: true, script: "git tag -l --points-at HEAD").trim()
               env.tag = tag
             }
      }
    }
    stage('GetOpsScripts') {
      steps {
        echo "GETTING SCRIPTS"
        sh '''
        git clone git@github.com:nci-hcmi-catalog/portal-ci.git
        '''
      }
    }
    stage('Build') {
      steps {
        sh '''
        portal-ci/build_stage/build.sh portal-ci
        '''
      }
    }
    stage('Deploy Dev') {
      when {
        expression {
          return env.BRANCH_NAME != 'master';
        }
      }
      steps {
        echo "DEPLOYING TO DEVELOPMENT: (${env.BUILD_URL})"
        sshPublisher(publishers: [
          sshPublisherDesc(
            configName: 'hcmi-dev', 
            transfers: [
              sshTransfer(
                excludes: '', 
                execCommand: 'cd hcmi && bash deploy/$BUILD_NUMBER/deploy.sh dev $BUILD_NUMBER', 
                execTimeout: 120000, 
                flatten: true, 
                makeEmptyDirs: false, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: '/deploy/$BUILD_NUMBER', 
                remoteDirectorySDF: false, 
                removePrefix: '', 
                sourceFiles: 'portal.tar, portal-ci/deploy_stage/deploy.sh')], 
              usePromotionTimestamp: false, 
              useWorkspaceInPromotion: false, 
              verbose: false)
          ])
        echo "DEPLOYED TO DEVELOPMENT: (${env.BUILD_URL})"
      }
      post {
        failure {
          echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
      }
    }
    stage('Deploy QA') {
      when {
       expression {
           return env.BRANCH_NAME == 'master';
       }
     }
     steps {
       echo "DEPLOYING TO QA: (${env.BUILD_URL})"
       sshPublisher(publishers: [
          sshPublisherDesc(
            configName: 'hcmi-qa', 
            transfers: [
              sshTransfer(
                excludes: '', 
                execCommand: 'bash deploy/$BUILD_NUMBER/deploy.sh qa $BUILD_NUMBER', 
                execTimeout: 120000, 
                flatten: true, 
                makeEmptyDirs: false, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: '/deploy/$BUILD_NUMBER', 
                remoteDirectorySDF: false, 
                removePrefix: '', 
                sourceFiles: 'portal.tar, portal-ci/deploy_stage/deploy.sh')], 
              usePromotionTimestamp: false, 
              useWorkspaceInPromotion: false, 
              verbose: false)
          ])
        
       echo "DEPLOYED TO QA: (${env.BUILD_URL})"
     }
     post {
       failure {
         echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
       }
     }
    }
    stage("Promotion portal to PRD") {
      when {
             expression {
               return env.BRANCH_NAME == 'master';
             }
             expression {
               return tag != '';
             }
           }
      steps {
             script {
                     env.DEPLOY_TO_PRD = input message: 'User input required',
                                     submitter: 'vermar',
                                     parameters: [choice(name: 'portal: Deploy to PRD Environment', choices: 'no\nyes', description: 'Choose "yes" if you want to deploy the PRD server')]
             }
     }
    }
    stage('Deploy PRD') {
      when {
       environment name: 'DEPLOY_TO_PRD', value: 'yes'
       expression {
           return env.BRANCH_NAME == 'master';
       }
       expression {
         return tag != '';
       }
     }
     steps {
       echo "DEPLOYING TO PRD: (${env.BUILD_URL})"
       sshPublisher(publishers: [
          sshPublisherDesc(
            configName: 'hcmi-prd', 
            transfers: [
              sshTransfer(
                excludes: '', 
                execCommand: 'bash deploy/$BUILD_NUMBER/deploy.sh prd $BUILD_NUMBER', 
                execTimeout: 120000, 
                flatten: true, 
                makeEmptyDirs: false, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: '/deploy/$BUILD_NUMBER', 
                remoteDirectorySDF: false, 
                removePrefix: '', 
                sourceFiles: 'portal.tar, portal-ci/deploy_stage/deploy.sh')], 
              usePromotionTimestamp: false, 
              useWorkspaceInPromotion: false, 
              verbose: false)
          ])
        
       echo "DEPLOYED TO PRD: (${env.BUILD_URL})"
     }
    }
  }
}

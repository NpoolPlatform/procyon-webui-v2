<template>
  <Page>
    <template #body>
      <h2>Procyon Platform - Security</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("KYC Security Application")'>KYC Security Application</a></li>
            <li><a @click='scrollTo("Google Authenticator (TOTP)")'>Google Authenticator (TOTP)</a></li>
            <li><a @click='scrollTo("Coin Withdrawal Audit")'>Coin Withdrawal Audit</a></li>
            <li><a @click='scrollTo("Abnormal Login Monitoring")'>Abnormal Login Monitoring</a></li>
            <li><a @click='scrollTo("Abnormal Transaction Monitoring")'>Abnormal Transaction Monitoring</a></li>
            <li><a @click='scrollTo("Website Secured with HTTPS")'>Website Secured with HTTPS</a></li>
            <li><a @click='scrollTo("Abnormal Network Access Monitoring")'>Abnormal Network Access Monitoring</a></li>
            <li><a @click='scrollTo("Offline Signature of Transactions")'>Offline Signature of Transactions</a></li>
            <li><a @click='scrollTo("Cold/Hot Storage of Encrypted Assets")'>Cold/Hot Storage of Encrypted Assets</a></li>
            <li><a @click='scrollTo("Private Keys are Encrypted by Random Passwords")'>Private Keys are Encrypted by Random Passwords</a></li>
            <li><a @click='scrollTo("RBAC Authorization System")'>RBAC Authorization System</a></li>
            <li><a @click='scrollTo("Passwords Stored in Salted Hash")'>Passwords Stored in Salted Hash</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='KYC Security Application'>
            KYC Security Application
          </h3>

          <p>
            Know Your Client (KYC) is a method of verifying a user's identity. Its purpose is to protect the user's
            funds. Before a user can manage assets and perform payments they must complete KYC. The platform uses the
            KYC feature to ensure that each asset operation is actually being conducted by the user and not a third
            party. This prevents others from impersonating the user and manipulating the user's own assets.
          </p>

          <h3 id='Google Authenticator (TOTP)'>
            Google Authenticator (TOTP)
          </h3>

          <p>
            Google Authentication is a form of Two-factor Authentication that uses a Time-based one-time password
            (TOTP) as a second layer of protection on top of the user’s password. It is a widely used method that
            prevents anyone from logging into the user’s account with a stolen password. Even if a hacker obtains a
            user’s password, they are extremely unlikely to also obtain the TOTP stored in Google Authenticator, meaning
            they cannot log into a user’s accounts, thus safeguarding user funds and information security.
          </p>

          <h3 id='Coin Withdrawal Audit'>
            Coin Withdrawal Audit
          </h3>

          <p>
            When a user attempts to withdraw cryptocurrency the operation is audited by the Procyon platform system.
            The system will audit the account information, KYC information, withdrawal address and other information to
            ensure the safety of the transaction. The system will ask the user to set up the withdrawal (receiving)
            address in advance and verify KYC information. If the withdrawal address is not in an address set by the
            user, the transaction will not be approved. In the case of many withdrawal operations in a short time users
            must submit the transaction to be manually audited by the administrators of the Procyon platform.
          </p>

          <h3 id='Abnormal Login Monitoring'>
            Abnormal Login Monitoring
          </h3>

          <p>
            The system will automatically verify if there is any abnormality in the login process. For example, if a
            user changes their usual browser or device, or attempts to login from a new location, etc. the system will
            flag the attempt and notify the user. The Procyon platform will also restrict concurrent logins by allowing
            only one login at a time. In addition, all login sessions expire after 4 hours and users are automatically
            logged out. The system will ask the user to login to the account again to ensure the user’s identity.
          </p>

          <h3 id='Abnormal Transaction Monitoring'>
            Abnormal Transaction Monitoring
          </h3>

          <p>
            The Procyon platform automatically checks and verifies each transaction. The system requires each
            transaction to match the complete user account information before the transaction can be completed. If a
            hacker attacks the platform API but is unable to obtain user information, the hacker will not be successful
            in carrying out a transaction using fraudulent user information.
          </p>

          <h3 id='Website Secured with HTTPS'>
            Website Secured with HTTPS
          </h3>

          <p>
            HTTPS provides authentication and encrypted communication methods. It is widely used for online secure
            communication, such as payments, etc. HTTPS is a secure HTTP protocol that secures the transmission process
            through encryption and authentication of web pages served in the browser.
          </p>

          <h3 id='Abnormal Network Access Monitoring'>
            Abnormal Network Access Monitoring
          </h3>

          <p>
            Procyon utilizes a private network in order to carry out transactions and other functions. The platform
            manages a list of access rights, allowing access only to devices/IPs in the list. The network connection to
            the transaction channel subsystem is unidirectional and does not accept external connections.
          </p>

          <h3 id='Offline Signature of Transactions'>
            Offline Signature of Transactions
          </h3>

          <p>
            If the content of each crypto asset transaction is like a contract, then each transaction requires a
            digital identity to sign the contract in order for the transaction to be truly valid. The system is designed
            so that this digital signature occurs offline (not connected to the Internet), which prevents hackers from
            obtaining the digital identity and generating transactions by impersonating users through network attacks.
          </p>

          <h3 id='Cold/Hot Storage of Encrypted Assets'>
            Cold/Hot Storage of Encrypted Assets
          </h3>

          <p>
            Procyon will specify a fixed amount of crypto assets above which they will be stored in an offline (not
            connected to the Internet) cold wallet. Transferring crypto assets from the cold wallet requires multiple
            layers of manual review, meaning hackers cannot access crypto assets via the Internet. The platform keeps
            only a small amount of crypto assets in the hot wallet that cover the typical daily transaction volume on
            the platform. This physically prevents the loss of any large amount of assets.
          </p>

          <h3 id='Private Keys are Encrypted by Random Passwords'>
            Private Keys are Encrypted by Random Passwords
          </h3>

          <p>
            Each private key is double-encrypted by a unique random password. Even if a hacker gets access to the
            encrypted data of one private key, he or she cannot use it directly, much less initiate a transaction using
            it. It also means that getting access to one private key does not grant access to any other private key.
          </p>

          <h3 id='RBAC Authorization System'>
            RBAC Authorization System
          </h3>

          <p>
            Role-based access control (RBAC) is a permission management and authorization system with three components,
            Resource, Role, and Permission. RBAC avoids security risks such as hacking by defining/setting the roles and
            permissions of users, and system access is authorized by these permissions.
          </p>

          <h3 id='Passwords Stored in Salted Hash'>
            Passwords Stored in Salted Hash
          </h3>

          <p>
            A hash is a kind of irreversible calculation. All passwords of user accounts are stored using hash
            encryption, which means the platform does not store the plaintext passwords of user accounts, but only
            stores the hashed passwords for the convenience of calling user data. Even if hackers get the hashed
            password file they cannot use the data to access a user’s account.
          </p>

          <p>
            The Procyon technical team has extensive experience in cybersecurity. The above is only a brief summary of
            the security measures that we have implemented on Procyon. Moreover, Procyon's technical team has been
            working in the field of technical security for more than five years, and in the field of software
            engineering for more than ten years, without any security incidents.
          </p>

          <div class='hr' />
        </div>
      </div>
    </template>
  </Page>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { scrollTo } from 'src/utils/scroll'

const Page = defineAsyncComponent(() => import('src/pages/faq/Page.vue'))

</script>

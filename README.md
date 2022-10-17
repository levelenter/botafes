# botafes

# server setting

ssh connect demo.blockvrock.com

```
./__dev/sv.sh
# ssh levelenter@demo.blockvrock.com
```

directory change and git clone

```
cd /data
sudo git clone https://github.com/levelenter/botafes.git
cd /data/botafes
```

nginx certbot setting

```
sudo certbot --nginx -d demo.blockvrock.com
```

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx
Starting new HTTPS connection (1): acme-v02.api.letsencrypt.org
Requesting a certificate for demo.blockvrock.com
Performing the following challenges:
http-01 challenge for demo.blockvrock.com
Using default address 80 for authentication.
Waiting for verification...
Cleaning up challenges
Could not automatically find a matching server block for demo.blockvrock.com. Set the `server_name` directive to use the Nginx installer.

IMPORTANT NOTES:
 - Unable to install the certificate
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/demo.blockvrock.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/demo.blockvrock.com/privkey.pem
   Your certificate will expire on 2023-01-15. To obtain a new or
   tweaked version of this certificate in the future, simply run
   certbot again with the "certonly" option. To non-interactively
   renew *all* of your certificates, run "certbot renew"
```

```
[levelenter@ik1-431-47986 botafes]$ sudo certbot renew
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/blockvrocks.com.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Cert not yet due for renewal

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/demo.blockvrock.com.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Cert not yet due for renewal
```

# prisma init

```
npx prisma init
npx prisma generate
npx prisma studio
```

```
docker-compose up -d --build
```

```
npx prisma migrate dev --name init
```

Docker
https://qiita.com/inakadegaebal/items/be9fecce813cebec5986

```
$ sudo yum remove docker docker-common docker-selinux docker-engine

sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum makecache fast
yum list docker-ce.x86_64 --showduplicates | sort -r


sudo yum install docker-ce

sudo systemctl start docker

sudo docker run hello-world

sudo groupadd docker

sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

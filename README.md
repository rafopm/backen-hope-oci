FROM oraclelinux:8

ARG release=19
ARG update=18

RUN  yum -y install oracle-release-el8 && \
     yum -y install oracle-instantclient${release}.${update}-basic oracle-instantclient${release}.${update}-devel oracle-instantclient${release}.${update}-sqlplus && \
     yum -y install unzip && \
     rm -rf /var/cache/yum

# Instala Node.js
RUN yum -y install @nodejs

# Uncomment if the tools package is added
# ENV PATH=$PATH:/usr/lib/oracle/${release}.${update}/client64/bin

WORKDIR /app

# Copia el código fuente de la aplicación
COPY package*.json .
RUN npm install -g npm@latest && npm install

# Copia el wallet al directorio predeterminado
COPY Wallet_*.zip /usr/lib/oracle/${release}.${update}/client64/lib/network/admin/

# Descomprime el wallet
RUN cd /usr/lib/oracle/${release}.${update}/client64/lib/network/admin/ && \
    unzip -B Wallet_*.zip

# Copia el resto del código fuente de la aplicación
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación Node.js
CMD ["npm", "start"]

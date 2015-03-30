FROM dockerfile/nodejs

ADD package.json index.js /data/
RUN cd /data; npm install
EXPOSE 80
CMD ["node", "/data/index.js"]
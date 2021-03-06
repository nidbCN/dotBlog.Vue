import Axios from "axios";
import config from "../config";

// 返回API的Url
function getApiUrlFunc(aid, point) {
    let baseUrl = config.base_url;
    if (aid !== undefined) {
        baseUrl += aid + "/";
        if (point !== undefined) {
            baseUrl += point + "/";
        }
    }
    console.log("拼接URL：" + baseUrl);
    return baseUrl;
}
// 获取随机封面
function getRandomCoverFunc() {
    return new Promise((resolve, reject) => {
        Axios.get(config.bing_api_url)
            .then(response => {
                let result = response.data.url;
                resolve(result) //相当于把东西提交
            }).catch(error =>
                reject(error) //提交错误
            );
    });
}

export default {
    // 获取文章列表
    getArticleList() {
        const url = getApiUrlFunc();
        return new Promise((resolve, reject) => {
            // Axios请求
            Axios.get(url)
                .then(response => {
                    let resultList = response.data;
                    // 检查是否有cover
                    for (let item of resultList) {
                        if (item.coverUrl == null) {
                            // 获取随机cover
                            getRandomCoverFunc().then((result) => {
                                item.coverUrl = result;
                                resolve(item);
                            });
                        }
                    }
                    resolve(resultList);
                })
                .catch(error =>
                    reject(error)
                );
        });

    },
    // 获取文章详情
    getArticleContent(aid) {
        const url = getApiUrlFunc(aid);
        return new Promise((resolve, reject) => {
            Axios.get(url)
                .then(response => {
                    let resultContent = response.data;
                    if (resultContent.coverUrl == null) {
                        getRandomCoverFunc().then((result) => {
                            resultContent.coverUrl = result;
                            resolve(resultContent);
                        });
                    }
                    resolve(resultContent);
                })
                .catch(error =>
                    reject(error)
                );
        });
    },
    // 点赞文章
    updateArticleLike(aid) {
        const url = getApiUrlFunc(aid, "Like");
        return new Promise((resolve, reject) => {
            Axios.post(url)
                .then(() =>
                    resolve()
                )
                .catch(error =>
                    reject(error)
                );
        });

    },
    // 阅读文章
    updateArticleRead(aid) {
        const url = getApiUrlFunc(aid, "Read");
        return new Promise((resolve, reject) => {
            Axios.post(url)
                .then(() =>
                    resolve()
                )
                .catch(error =>
                    reject(error)
                );
        });
    }
}
<template>
    <div class="container" v-if="showPage">
        <header-template :tag="tag"/>

        <div v-if="tag==='头像'" style="margin-top: .3rem;background-color: white;padding: 1rem 0 1rem 0;">
            <van-row>
                <van-col offset="8" span="8">
                    <van-image
                            round
                            width="2.5rem"
                            height="2.5rem"
                            :src="info.imgReduce"
                            @click="previewHeader"/>
                </van-col>
                <van-col offset="11" span="8" style="margin-top: -1rem">
                    <van-uploader type="primary" :before-read="beforeUploadHeader" :after-read="uploadHeader">
                        <van-icon name="photograph" size=".8rem" color="#19c5ff"/>
                    </van-uploader>
                </van-col>
            </van-row>
        </div>

        <div v-if="tag==='背景'" style="margin-top: .3rem;">
            <van-row>
                <van-col span="24">
                    <van-uploader type="primary" :before-read="beforeUploadHeader" :after-read="uploadBackground">
                        <van-image
                                width="10rem"
                                fit="contain"
                                :src="info.backgroundImg"
                        />
                    </van-uploader>
                </van-col>
            </van-row>
        </div>


        <van-cell-group v-if="tag==='签名'" style="margin-top: .3rem;">
            <van-field v-model="signature"
                       rows="2"
                       autosize
                       label="个性签名："
                       type="textarea"
                       maxlength="50"
                       show-word-limit
                       :placeholder="signaturePlaceholder"/>
            <van-button style="margin: .5rem;width: 3rem" type="default"
                        @click="updateSignature">完成
            </van-button>
        </van-cell-group>

        <van-cell-group v-if="tag==='昵称'" style="margin-top: .3rem;">
            <van-field v-model="nickname"
                       rows="2"
                       autosize
                       label="昵称："
                       type="textarea"
                       maxlength="50"
                       show-word-limit
                       :placeholder="nicknamePlaceholder"/>
            <van-button style="margin: .5rem;width: 3rem" type="default"
                        @click="updateNickname">完成
            </van-button>
        </van-cell-group>

        <van-cell-group v-if="tag==='职业'" style="margin-top: .3rem;">
            <van-field v-model="profession"
                       rows="2"
                       autosize
                       label="职业："
                       type="textarea"
                       maxlength="50"
                       show-word-limit
                       :placeholder="professionPlaceholder"/>
            <van-button style="margin: .5rem;width: 3rem" type="default"
                        @click="updateProfession">完成
            </van-button>
        </van-cell-group>

        <van-cell-group v-if="tag==='公司'" style="margin-top: .3rem;">
            <van-field v-model="company"
                       rows="2"
                       autosize
                       label="公司："
                       type="textarea"
                       maxlength="50"
                       show-word-limit
                       :placeholder="companyPlaceholder"/>
            <van-button style="margin: .5rem;width: 3rem" type="default"
                        @click="updateCompany">完成
            </van-button>
        </van-cell-group>

    </div>
</template>

<script>
    import HeaderTemplate from "@/components/HeaderTemplate";
    import {Toast} from 'vant';
    import {mapActions, mapGetters} from "vuex";
    import USER from "@/api/user";
    import FILE_UPLOAD from "@/api/fileUpload";
    import {ImagePreview} from "vant";

    export default {
        name: "ChildEditPage",
        components: {HeaderTemplate},
        data() {
            return {
                showPage: false,
                tag: "",
                signature: '',
                signaturePlaceholder: '',
                nickname: '',
                nicknamePlaceholder: '',
                profession: '',
                professionPlaceholder: '',
                company: '',
                companyPlaceholder: '',
                info: {
                    userId: -1,
                    signature: '',
                    profession: "",
                    company: "",
                    imgReduce: "",
                    img: "",
                    backgroundImg: "",
                }
            }
        },
        methods: {
            ...mapActions(['LoginAction']),
            ...mapGetters(['getUserCache', 'getMyId', 'getViewingId']),
            initData() {
                let currentId = this.getViewingId();
                if (currentId === this.getMyId()) {
                    this.showPage = true;
                    // 新页面标题,通过路由传递
                    this.tag = this.$route.query.tag;
                    // 从缓存中拿
                    this.info = this.getUserCache();
                    // 输入框提醒
                    this.signaturePlaceholder = this.info.signature;
                    this.nicknamePlaceholder = this.info.nickname;
                    this.professionPlaceholder = this.info.profession;
                    this.companyPlaceholder = this.info.company;
                }
            },
            /**
             * 更新数据
             */
            update(info) {
                let that = this;
                USER.updateUserInfo(info.userId, info).then(function (resp) {
                    if (resp.data.status) {
                        // 更新缓存
                        that.LoginAction(resp.data.data);
                    }
                }).catch((err) => console.log(err));
            },
            /**
             * 更改签名
             */
            updateSignature() {
                let signature = this.signature;
                if (signature) {
                    let data = {
                        userId: this.info.userId,
                        signature: signature
                    };
                    this.update(data);
                }
            },
            /**
             * 更改签名
             */
            updateNickname() {
                let nickname = this.nickname;
                if (nickname) {
                    let data = {
                        userId: this.info.userId,
                        nickname: nickname
                    };
                    this.update(data);
                }
            },
            /**
             * 更改职业
             */
            updateProfession() {
                let profession = this.profession;
                if (profession) {
                    let data = {
                        userId: this.info.userId,
                        profession: profession
                    };
                    this.update(data);
                }
            },
            /**
             * 更改公司
             */
            updateCompany() {
                let company = this.company;
                if (company) {
                    let data = {
                        userId: this.info.userId,
                        company: company
                    };
                    this.update(data);
                }
            },
            /**
             * 点击头像预览图片
             */
            previewHeader() {
                this.previewImg(this.info.img);
            },
            /**
             * 点击背景预览
             */
            previewBackground() {
                this.previewImg(this.info.img);
            },
            previewImg(img) {
                ImagePreview([img]);
            },
            /**
             * 上传头像
             */
            uploadHeader(photo) {
                let userId = this.getMyId();
                let that = this;
                FILE_UPLOAD.uploadFile(userId, photo).then(function (resp) {
                    if (resp.data.status) {
                        that.info.imgReduce = resp.data.data.imgReduce;
                        that.info.img = resp.data.data.img;
                        // 更新缓存
                        let cache = that.getUserCache();
                        cache.imgReduce = that.info.imgReduce;
                        cache.img = that.info.img;
                        that.LoginAction(cache);
                    }else{
                        Toast(resp.data.message);
                    }
                }).catch(function (err) {
                    console.log(err);
                })
            },
            /**
             * 上传背景图
             */
            uploadBackground(photo) {
                let userId = this.getMyId();
                let that = this;
                FILE_UPLOAD.upload(userId, photo).then(function (resp) {
                    if (resp.data.status) {
                        console.log(resp);
                        that.info.backgroundImg = resp.data.data;
                        // 更新缓存
                        let cache = that.getUserCache();
                        cache.backgroundImg = that.info.backgroundImg;
                        that.LoginAction(cache);
                    }else{
                        Toast(resp.data.message);
                    }
                }).catch(function (err) {
                    console.log(err);
                })

            },
            beforeUploadHeader(file) {
                if (file.type !== 'image/jpeg') {
                    Toast('请上传 jpg 格式图片');
                    return false;
                }
                return true;
            },


        },
        created() {
            this.initData();
        },
    }
</script>

<style scoped>
    .container {
        height: 100%;
        width: 100%;
        background: #eeeeee;
    }

</style>
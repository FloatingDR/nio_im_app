<template>
    <div class="container">
        <header-template :tag="tag"/>

        <van-cell-group style="margin-top: .3rem;width: 100%">
            <van-cell class="text_cell" is-link title="头像" center size="large" @click="goChildPage('头像')"/>
            <van-cell class="text_cell" is-link title="背景" center size="large" @click="goChildPage('背景')"/>
            <van-cell class="text_cell" is-link title="昵称" center :value="info.nickname" size="large"
                      @click="goChildPage('昵称')"/>
            <van-cell class="text_cell" is-link title="签名" center size="large" @click="goChildPage('签名')"/>
            <van-cell class="text_cell" title="性别" center :value="info.gender" size="large" @click="showChangeGender"/>
            <van-cell class="text_cell" is-link title="生日" center size="large" @click="showChangeBirthday"/>
        </van-cell-group>

        <van-cell-group style="margin-top: .3rem;width: 100%">
            <van-cell class="text_cell" is-link title="职业" center :value="info.profession" size="large"
                      @click="goChildPage('职业')"/>
            <van-cell class="text_cell" is-link title="公司" center :value="info.company" size="large"
                      @click="goChildPage('公司')"/>
            <van-cell class="text_cell" is-link title="所在地" center :value="info.address" size="large"
                      @click="showChangeAddress()"/>
            <van-cell class="text_cell" is-link title="故乡" center :value="info.hometown" size="large"
                      @click="showSelectHometown=true"/>
        </van-cell-group>

        <van-popup v-model="showSelectDate" position="bottom" round :style="{ height: '30%' }">
            <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :formatter="formatter"
                    @confirm="dateConfirm"
                    @cancel="dateCancel"
            />
        </van-popup>

        <van-popup v-model="showSelectGender" position="bottom" round :style="{ height: '30%'}">
            <van-row style="margin-top: .8rem">
                <van-col span="8"></van-col>
                <van-col span="8">
                    <van-radio-group v-model="info.gender">
                        <van-cell-group>
                            <van-cell title="男" clickable @click="updateGender">
                                <van-radio slot="right-icon" name="男"/>
                            </van-cell>
                            <van-cell title="女" clickable @click="updateGender">
                                <van-radio slot="right-icon" name="女"/>
                            </van-cell>
                        </van-cell-group>
                    </van-radio-group>
                </van-col>
                <van-col span="8"></van-col>
            </van-row>
        </van-popup>

        <van-popup v-model="showSelectAddress" position="bottom" round :style="{ height: '30%' }">
            <van-area :area-list="areaList"
                      @cancel="showSelectAddress=false"
                      @confirm="updateAddress"
            />
        </van-popup>

        <van-popup v-model="showSelectHometown" position="bottom" round :style="{ height: '30%' }">
            <van-area :area-list="areaList"
                      @cancel="showSelectHometown=false"
                      @confirm="updateHometown"
            />
        </van-popup>

    </div>
</template>

<script>
    import HeaderTemplate from "@/components/HeaderTemplate";
    import AreaList from "@/data/AreaList";
    import USER from "@/api/user";
    import {mapActions, mapGetters} from "vuex";

    /**
     * 格式化地址
     */
    function formatAddress(columnsNum) {
        let address = "";
        let province = columnsNum[0].name + " ";
        let city = columnsNum[1].name + " ";
        let contry = columnsNum[2].name;
        address = province;
        if (province !== city) {
            address += city;
        }
        address += contry;
        return address;
    }

    export default {
        name: "EditInfo",
        components: {HeaderTemplate},
        data() {
            return {
                id: -1,
                tag: "编辑资料",
                showSelectDate: false,
                showSelectGender: false,
                showSelectAddress: false,
                showSelectHometown: false,
                minDate: new Date(1900, 0, 1),
                maxDate: new Date(),
                currentDate: new Date(),
                info: {
                    "userId": -1,
                    "imgReduce": "",
                    "img": "",
                    "signature": "",
                    "birthday": "",
                    "nickname": "",
                    "profession": "",
                    "company": "",
                    "address": "",
                    "hometown": "",
                    "gender": "",
                },
                areaList: AreaList,

            }
        },
        methods: {
            ...mapActions(['LoginAction']),
            ...mapGetters(['getUserCache']),
            initData() {
                let that = this;
                that.currentId = that.$route.query.id;
                // 从缓存中拿(更改自己的数据)
                that.info = that.getUserCache();
                // 更新生日组件
                let date = that.info.birthday;
                that.info.birthday = date.split(" ")[0];
                that.currentDate = new Date(that.info.birthday);
            },
            formatter(type, val) {
                if (type === 'year') {
                    return `${val}年`;
                } else if (type === 'month') {
                    return `${val}月`
                } else if (type === 'day') {
                    return `${val}日`
                }
                return val;
            },
            showChangeBirthday() {
                this.showSelectDate = true;
            },
            dateCancel() {
                this.showSelectDate = false;
            },
            showChangeGender() {
                this.showSelectGender = true;
            },
            showChangeAddress() {
                this.showSelectAddress = true;
            }
            ,
            /**
             * 更改生日
             */
            dateConfirm() {
                let info = this.info;
                this.showSelectDate = false;
                let year = this.currentDate.getFullYear();
                let month = this.currentDate.getMonth() + 1;
                let day = this.currentDate.getDate();
                let date = year + '-';
                if (month < 10) {
                    date += '0' + month + '-';
                } else {
                    date += month + '-';
                }
                if (day < 10) {
                    date += '0' + day + '-';
                } else {
                    date += day;
                }
                date += ' 00:00:00';
                let user = {
                    'birthday': date,
                };
                let that = this;
                USER.updateUserInfo(info.userId, user).then(function (resp) {
                    if (resp.data.status) {
                        let date = resp.data.data.birthday;
                        info.birthday = date.split(" ")[0];
                        that.currentDate = new Date(info.birthday);
                        // 更新缓存
                        that.LoginAction(resp.data.data);
                    }
                }).catch((err) => console.log(err));
            }
            ,
            /**
             * 更改性别
             */
            updateGender() {
                let info = this.info;
                let user = {
                    userId: info.userId,
                    gender: info.gender,
                };
                this.update(user);
            },

            /**
             * 更改地址
             */
            updateAddress(columnsNum) {
                let address = formatAddress(columnsNum);
                let user = {
                    userId: this.info.userId,
                    address: address
                };
                this.update(user);
                this.info.address = address;
                this.showSelectAddress = false;
            },
            /**
             * 更改故乡
             */
            updateHometown(columnsNum) {
                let address = formatAddress(columnsNum);
                let user = {
                    userId: this.info.userId,
                    hometown: address
                };
                this.update(user);
                this.info.hometown = address;
                this.showSelectHometown = false;
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
             * 跳转到子页面更改
             */
            goChildPage(value) {
                this.$router.push({path: '/childEditPage', query: {tag: value}});
            },


        },
        created() {
            this.initData();
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .container {
        height: 100%;
        width: 100%;
        background: #eeeeee;
    }

    .text_cell {
        text-align: left;
    }

</style>
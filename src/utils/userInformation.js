import { DICT_FIXED } from './city';
//学历类别
let EducationalCategory = [
    { value: "", text: "请选择" },
    { value: "1", text: "普通（统招）" },
    { value: "2", text: "普通专升本（统招）" },
    { value: "3", text: "成人高考" },
    { value: "4", text: "自考" },
    { value: "5", text: "电大" },
    { value: "6", text: "网络教育" },
];

//学制
let SchoolSystem = [
    { value: "", text: "请选择" },
    { value: "1", text: "2年" },
    { value: "2", text: "2.5年" },
    { value: "3", text: "3年" },
    { value: "4", text: "4年" },
    { value: "5", text: "5年" }
];

//证件类型
let CredentialsType = [
    { value: "", text: "请选择" },
    { value: "1", text: "居民身份证" },
    { value: "2", text: "护照" },
    { value: "3", text: "台湾居民来往大陆通行证" },
    { value: "4", text: "港澳居民来往大陆通行证" },
    { value: "5", text: "外国人永久居留身份证" },
    { value: "6", text: "港澳台居民居住证" }
];
// 企业性质
let EnterpriseProperty = [
    { text: '国有企业', value: '1' },
    { text: '集体所有制', value: '2' },
    { text: '私营企业', value: '3' },
    { text: '股份制企业', value: '4' },
    { text: '有限合伙企业', value: '5' },
    { text: '联营企业', value: '6' },
    { text: '外商投资企业', value: '7' },
    { text: '个人独资企业', value: '8' }
]
//省\市
let GetCity = (function () {
    let data = [];
    DICT_FIXED.map((item) => {
        let parent = {
            id: item.id,
            pid: null,
            value: item.name,
            name: item.name,
            label: item.name,
        }
        let children = [];
        item.children.map((item1) => {
            let child = {
                id: item1.id,
                pid: item.id,
                value: item1.name,
                name: item1.name,
                label: item1.name,
            }
            children.push(child);
        })
        parent.children = children;
        data.push(parent);
    })
    return data;
}());


export { EducationalCategory, SchoolSystem, CredentialsType, GetCity, EnterpriseProperty }
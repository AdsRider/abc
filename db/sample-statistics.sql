BEGIN;

INSERT INTO address (address, privatekey)
VALUES
('0x20177a79778ae65d8c3ccd1ff0bb59f448f7b3f4', '0x444846525a178e213865a9d29bbccd510512d0cbb9a5b31e2697748e4ef4ae04'),
('0x5d593a5a013d24145165e14c129ec1c631915008', '0x01d6da9807edbe593a4dd861cbf06b43c4d857d14ebae349a590e7582783f2ed')
ON CONFLICT DO NOTHING;

INSERT INTO public.user (email, password, level, address)
VALUES
('rs', '$argon2i$v=19$m=4096,t=3,p=1$X1o9eY4uHF829VCjkXoGog$ZDy92DyHDWxfMJOgOjAlAcr0U989xQQ6k2VYlmzfpTs', '라이더', '0x20177a79778ae65d8c3ccd1ff0bb59f448f7b3f4'),
('as', '$argon2i$v=19$m=4096,t=3,p=1$FTYDuTu7s0ptIrQSPrhLFQ$QHDDPSFukCMOq/7GX8f3oe9mcp1yffTj2ie7YUPouSI', '광고주', '0x5d593a5a013d24145165e14c129ec1c631915008')
ON CONFLICT DO NOTHING;

INSERT INTO ads (id, title, subtitle, reward, image_id, start_date, end_date, user_email)
VALUES (333, 'Statistics Test', 'Sample Data for Statistics', '1000000', 3, '2023-06-01T17:36:18.106Z', '2023-07-01T17:36:18.106Z', 'as');

INSERT INTO ads_result (ads_id, user_email, meters, reward, start_time, end_time, path)
VALUES
(333, 'rs', 2189, '2189', '2023-06-15T17:36:18.106Z', '2023-06-15T18:36:18.106Z', '[{"latitude":"37.3400306","longitude":"126.7335028"},{"latitude":"37.3397262","longitude":"126.7331622"},{"latitude":"37.3397542","longitude":"126.7331391"},{"latitude":"37.3395634","longitude":"126.7329279"},{"latitude":"37.3393864","longitude":"126.7327688"},{"latitude":"37.3403322","longitude":"126.7312594"},{"latitude":"37.3412842","longitude":"126.7297365"},{"latitude":"37.3412841","longitude":"126.7297358"},{"latitude":"37.3413420","longitude":"126.7297910"},{"latitude":"37.3422998","longitude":"126.7310971"},{"latitude":"37.3435586","longitude":"126.7323268"},{"latitude":"37.3438131","longitude":"126.7324828"},{"latitude":"37.3440558","longitude":"126.7324056"},{"latitude":"37.3457705","longitude":"126.7340818"},{"latitude":"37.3475965","longitude":"126.7358734"},{"latitude":"37.3487892","longitude":"126.7374360"},{"latitude":"37.3502942","longitude":"126.7387591"},{"latitude":"37.3501387","longitude":"126.7390042"},{"latitude":"37.3500224","longitude":"126.7391888"},{"latitude":"37.3499849","longitude":"126.7392000"},{"latitude":"37.3499142","longitude":"126.7392242"},{"latitude":"37.3509031","longitude":"126.7402701"},{"latitude":"37.3518892","longitude":"126.7410206"},{"latitude":"37.3516663","longitude":"126.7417788"},{"latitude":"37.3517000","longitude":"126.7427528"}]'),
(333, 'rs', 4098, '4098', '2023-06-16T17:36:18.106Z', '2023-06-16T18:36:18.106Z', '[{"latitude":"37.3228722","longitude":"126.7039944"},{"latitude":"37.3228526","longitude":"126.7039535"},{"latitude":"37.3228530","longitude":"126.7039538"},{"latitude":"37.3229904","longitude":"126.7036789"},{"latitude":"37.3231604","longitude":"126.7033407"},{"latitude":"37.3227905","longitude":"126.7038413"},{"latitude":"37.3224684","longitude":"126.7043764"},{"latitude":"37.3238643","longitude":"126.7057623"},{"latitude":"37.3252433","longitude":"126.7070419"},{"latitude":"37.3238751","longitude":"126.7092486"},{"latitude":"37.3224721","longitude":"126.7115251"},{"latitude":"37.3225141","longitude":"126.7115631"},{"latitude":"37.3226123","longitude":"126.7116534"},{"latitude":"37.3312520","longitude":"126.7204039"},{"latitude":"37.3406335","longitude":"126.7294990"},{"latitude":"37.3406408","longitude":"126.7294997"},{"latitude":"37.3410791","longitude":"126.7295355"},{"latitude":"37.3411516","longitude":"126.7296062"},{"latitude":"37.3411988","longitude":"126.7296534"},{"latitude":"37.3402470","longitude":"126.7311768"},{"latitude":"37.3392799","longitude":"126.7327928"},{"latitude":"37.3393285","longitude":"126.7328490"},{"latitude":"37.3397577","longitude":"126.7331432"},{"latitude":"37.3397343","longitude":"126.7331486"},{"latitude":"37.3400306","longitude":"126.7335028"}]'),
(333, 'rs', 1909, '1909', '2023-06-17T17:36:18.106Z', '2023-06-17T19:36:18.106Z', '[{"latitude":"37.3283306","longitude":"126.7878694"},{"latitude":"37.3283954","longitude":"126.7878725"},{"latitude":"37.3284497","longitude":"126.7878360"},{"latitude":"37.3285583","longitude":"126.7878236"},{"latitude":"37.3285774","longitude":"126.7878218"},{"latitude":"37.3246434","longitude":"126.7959137"},{"latitude":"37.3215532","longitude":"126.8050484"},{"latitude":"37.3212500","longitude":"126.8055772"},{"latitude":"37.3206500","longitude":"126.8063111"}]'),
(333, 'rs', 3194, '3194', '2023-06-17T17:36:18.106Z', '2023-06-17T19:36:18.106Z', '[{"latitude":"37.3555944","longitude":"126.7119972"},{"latitude":"37.3542982","longitude":"126.7141338"},{"latitude":"37.3547499","longitude":"126.7148398"},{"latitude":"37.3547254","longitude":"126.7152133"},{"latitude":"37.3545793","longitude":"126.7156474"},{"latitude":"37.3545687","longitude":"126.7156508"},{"latitude":"37.3544436","longitude":"126.7158030"},{"latitude":"37.3537356","longitude":"126.7164329"},{"latitude":"37.3532808","longitude":"126.7174224"},{"latitude":"37.3532682","longitude":"126.7174393"},{"latitude":"37.3532348","longitude":"126.7174877"},{"latitude":"37.3532342","longitude":"126.7174870"},{"latitude":"37.3531054","longitude":"126.7173640"},{"latitude":"37.3516909","longitude":"126.7197748"},{"latitude":"37.3502163","longitude":"126.7224049"},{"latitude":"37.3504105","longitude":"126.7225870"},{"latitude":"37.3506364","longitude":"126.7228078"},{"latitude":"37.3533331","longitude":"126.7258042"},{"latitude":"37.3564576","longitude":"126.7284932"},{"latitude":"37.3564867","longitude":"126.7285202"},{"latitude":"37.3565895","longitude":"126.7286199"},{"latitude":"37.3563599","longitude":"126.7289675"},{"latitude":"37.3561444","longitude":"126.7293694"},{"latitude":"37.3562543","longitude":"126.7295227"},{"latitude":"37.3586601","longitude":"126.7318641"},{"latitude":"37.3610983","longitude":"126.7341409"},{"latitude":"37.3607564","longitude":"126.7347527"},{"latitude":"37.3602762","longitude":"126.7356322"},{"latitude":"37.3608029","longitude":"126.7359515"},{"latitude":"37.3613976","longitude":"126.7363571"},{"latitude":"37.3612619","longitude":"126.7369462"},{"latitude":"37.3616995","longitude":"126.7373788"},{"latitude":"37.3615854","longitude":"126.7377752"},{"latitude":"37.3618167","longitude":"126.7381500"}]'),
(333, 'rs', 1227, '1227', '2023-06-17T17:36:18.106Z', '2023-06-17T19:36:18.106Z', '[{"latitude":"37.3425194","longitude":"126.7356806"},{"latitude":"37.3434202","longitude":"126.7341542"},{"latitude":"37.3443202","longitude":"126.7326724"},{"latitude":"37.3443200","longitude":"126.7326718"},{"latitude":"37.3444118","longitude":"126.7327279"},{"latitude":"37.3443240","longitude":"126.7325871"},{"latitude":"37.3440745","longitude":"126.7323401"},{"latitude":"37.3440672","longitude":"126.7323289"},{"latitude":"37.3442049","longitude":"126.7322236"},{"latitude":"37.3449272","longitude":"126.7310816"},{"latitude":"37.3455874","longitude":"126.7298854"},{"latitude":"37.3461166","longitude":"126.7289458"},{"latitude":"37.3467037","longitude":"126.7280749"},{"latitude":"37.3467611","longitude":"126.7279897"},{"latitude":"37.3468334","longitude":"126.7278829"},{"latitude":"37.3468737","longitude":"126.7278373"},{"latitude":"37.3462986","longitude":"126.7272843"},{"latitude":"37.3445111","longitude":"126.7254778"}]'),
(333, 'rs', 6523, '6523', '2023-06-18T17:36:18.106Z', '2023-06-18T19:36:18.106Z', '[{"latitude":"37.3214000","longitude":"126.6793250"},{"latitude":"37.3201363","longitude":"126.6815588"},{"latitude":"37.3203734","longitude":"126.6842474"},{"latitude":"37.3214943","longitude":"126.6868645"},{"latitude":"37.3234969","longitude":"126.6888384"},{"latitude":"37.3113830","longitude":"126.7108781"},{"latitude":"37.3034942","longitude":"126.7354522"},{"latitude":"37.3010614","longitude":"126.7342060"},{"latitude":"37.3000167","longitude":"126.7381667"}]'),
(333, 'rs', 2344, '2344', '2023-06-18T17:36:18.106Z', '2023-06-18T19:36:18.106Z', '[{"latitude":"37.3307333","longitude":"126.7482194"},{"latitude":"37.3351020","longitude":"126.7519887"},{"latitude":"37.3383144","longitude":"126.7572558"},{"latitude":"37.3384811","longitude":"126.7574145"},{"latitude":"37.3387048","longitude":"126.7576261"},{"latitude":"37.3370801","longitude":"126.7602482"},{"latitude":"37.3354641","longitude":"126.7628762"},{"latitude":"37.3363113","longitude":"126.7637259"},{"latitude":"37.3371129","longitude":"126.7644992"},{"latitude":"37.3368970","longitude":"126.7648468"},{"latitude":"37.3364870","longitude":"126.7655213"},{"latitude":"37.3369888","longitude":"126.7659985"},{"latitude":"37.3372556","longitude":"126.7671611"}]'),
(333, 'rs', 5814, '5814', '2023-06-19T17:36:18.106Z', '2023-06-19T19:36:18.106Z', '[{"latitude":"37.3456361","longitude":"126.6875472"},{"latitude":"37.3457482","longitude":"126.6876383"},{"latitude":"37.3458881","longitude":"126.6876995"},{"latitude":"37.3456312","longitude":"126.6876712"},{"latitude":"37.3453855","longitude":"126.6877201"},{"latitude":"37.3483217","longitude":"126.6950374"},{"latitude":"37.3516794","longitude":"126.7044089"},{"latitude":"37.3638890","longitude":"126.7102620"},{"latitude":"37.3754346","longitude":"126.7215903"},{"latitude":"37.3754340","longitude":"126.7215902"},{"latitude":"37.3753806","longitude":"126.7217373"},{"latitude":"37.3746101","longitude":"126.7229472"},{"latitude":"37.3736811","longitude":"126.7244831"},{"latitude":"37.3735911","longitude":"126.7243955"},{"latitude":"37.3730097","longitude":"126.7238498"},{"latitude":"37.3729233","longitude":"126.7234503"},{"latitude":"37.3722825","longitude":"126.7232192"},{"latitude":"37.3721267","longitude":"126.7227910"},{"latitude":"37.3720917","longitude":"126.7217472"}]'),
(333, 'rs', 1502, '1502', '2023-06-19T17:36:18.106Z', '2023-06-19T19:36:18.106Z', '[{"latitude":"37.3302333","longitude":"126.7548250"},{"latitude":"37.3317270","longitude":"126.7539557"},{"latitude":"37.3324572","longitude":"126.7547612"},{"latitude":"37.3333527","longitude":"126.7589200"},{"latitude":"37.3343944","longitude":"126.7637361"},{"latitude":"37.3347215","longitude":"126.7640451"},{"latitude":"37.3348934","longitude":"126.7639973"},{"latitude":"37.3362734","longitude":"126.7653157"},{"latitude":"37.3372556","longitude":"126.7671611"}]');
(333, 'rs', 5324, '5324', '2023-06-20T17:36:18.106Z', '2023-06-20T19:36:18.106Z', '[{"latitude":"37.3282000","longitude":"126.6880333"},{"latitude":"37.3223470","longitude":"126.6974353"},{"latitude":"37.3165717","longitude":"126.7067796"},{"latitude":"37.3192766","longitude":"126.7095700"},{"latitude":"37.3220237","longitude":"126.7122285"},{"latitude":"37.3220080","longitude":"126.7123054"},{"latitude":"37.3219848","longitude":"126.7124303"},{"latitude":"37.3223365","longitude":"126.7119679"},{"latitude":"37.3225605","longitude":"126.7116059"},{"latitude":"37.3225604","longitude":"126.7116055"},{"latitude":"37.3226123","longitude":"126.7116534"},{"latitude":"37.3291382","longitude":"126.7183341"},{"latitude":"37.3359575","longitude":"126.7249445"},{"latitude":"37.3358094","longitude":"126.7246746"},{"latitude":"37.3358288","longitude":"126.7244656"},{"latitude":"37.3357598","longitude":"126.7243918"},{"latitude":"37.3357036","longitude":"126.7243337"},{"latitude":"37.3346295","longitude":"126.7260448"},{"latitude":"37.3335111","longitude":"126.7277500"}]'),
(333, 'rs', 6190, '6190', '2023-06-20T17:36:18.106Z', '2023-06-20T19:36:18.106Z', '[{"latitude":"37.3369333","longitude":"126.7152694"},{"latitude":"37.3374075","longitude":"126.7161758"},{"latitude":"37.3374865","longitude":"126.7164600"},{"latitude":"37.3356479","longitude":"126.7194407"},{"latitude":"37.3337762","longitude":"126.7224553"},{"latitude":"37.3338121","longitude":"126.7224940"},{"latitude":"37.3338888","longitude":"126.7225774"},{"latitude":"37.3385880","longitude":"126.7275135"},{"latitude":"37.3435586","longitude":"126.7323268"},{"latitude":"37.3438131","longitude":"126.7324828"},{"latitude":"37.3440558","longitude":"126.7324056"},{"latitude":"37.3441177","longitude":"126.7324672"},{"latitude":"37.3441661","longitude":"126.7325187"},{"latitude":"37.3438312","longitude":"126.7330425"},{"latitude":"37.3434130","longitude":"126.7337194"},{"latitude":"37.3434128","longitude":"126.7337185"},{"latitude":"37.3432051","longitude":"126.7335557"},{"latitude":"37.3416599","longitude":"126.7361263"},{"latitude":"37.3399592","longitude":"126.7386062"},{"latitude":"37.3399588","longitude":"126.7386057"},{"latitude":"37.3398667","longitude":"126.7385168"},{"latitude":"37.3386548","longitude":"126.7406136"},{"latitude":"37.3373864","longitude":"126.7428862"},{"latitude":"37.3375047","longitude":"126.7430060"},{"latitude":"37.3375912","longitude":"126.7430939"},{"latitude":"37.3370931","longitude":"126.7439042"},{"latitude":"37.3365972","longitude":"126.7447333"},{"latitude":"37.3365914","longitude":"126.7448101"},{"latitude":"37.3364180","longitude":"126.7446222"},{"latitude":"37.3292920","longitude":"126.7380485"},{"latitude":"37.3220768","longitude":"126.7310451"},{"latitude":"37.3221476","longitude":"126.7309300"},{"latitude":"37.3221906","longitude":"126.7308613"},{"latitude":"37.3222848","longitude":"126.7309602"},{"latitude":"37.3223765","longitude":"126.7310267"},{"latitude":"37.3209872","longitude":"126.7332386"},{"latitude":"37.3197056","longitude":"126.7356194"}]'),
(333, 'rs', 5479, '5479', '2023-06-21T17:36:18.106Z', '2023-06-21T19:36:18.106Z', '[{"latitude":"37.3349778","longitude":"126.6906750"},{"latitude":"37.3353236","longitude":"126.6910141"},{"latitude":"37.3354139","longitude":"126.6915016"},{"latitude":"37.3348278","longitude":"126.6918051"},{"latitude":"37.3343227","longitude":"126.6923256"},{"latitude":"37.3359133","longitude":"126.6944869"},{"latitude":"37.3379156","longitude":"126.6961812"},{"latitude":"37.3354287","longitude":"126.7006443"},{"latitude":"37.3326400","longitude":"126.7051527"},{"latitude":"37.3326396","longitude":"126.7051518"},{"latitude":"37.3324550","longitude":"126.7049730"},{"latitude":"37.3323115","longitude":"126.7050232"},{"latitude":"37.3319154","longitude":"126.7048619"},{"latitude":"37.3441098","longitude":"126.7168185"},{"latitude":"37.3564576","longitude":"126.7284932"},{"latitude":"37.3564867","longitude":"126.7285202"},{"latitude":"37.3565895","longitude":"126.7286199"},{"latitude":"37.3563599","longitude":"126.7289675"},{"latitude":"37.3561444","longitude":"126.7293694"},{"latitude":"37.3562543","longitude":"126.7295227"},{"latitude":"37.3565475","longitude":"126.7298147"},{"latitude":"37.3568528","longitude":"126.7301639"}]'),
(333, 'rs', 2818, '2818', '2023-06-21T17:36:18.106Z', '2023-06-21T19:36:18.106Z', '[{"latitude":"37.3649750","longitude":"126.7113722"},{"latitude":"37.3649440","longitude":"126.7113972"},{"latitude":"37.3649445","longitude":"126.7113974"},{"latitude":"37.3641231","longitude":"126.7106277"},{"latitude":"37.3630711","longitude":"126.7096472"},{"latitude":"37.3607250","longitude":"126.7136015"},{"latitude":"37.3582002","longitude":"126.7177742"},{"latitude":"37.3566663","longitude":"126.7167502"},{"latitude":"37.3548473","longitude":"126.7152131"},{"latitude":"37.3549258","longitude":"126.7154009"},{"latitude":"37.3549033","longitude":"126.7154442"},{"latitude":"37.3548848","longitude":"126.7154747"},{"latitude":"37.3546160","longitude":"126.7156350"},{"latitude":"37.3545696","longitude":"126.7156508"},{"latitude":"37.3544436","longitude":"126.7158030"},{"latitude":"37.3537356","longitude":"126.7164329"},{"latitude":"37.3532808","longitude":"126.7174224"},{"latitude":"37.3532682","longitude":"126.7174393"},{"latitude":"37.3532348","longitude":"126.7174877"},{"latitude":"37.3532342","longitude":"126.7174870"},{"latitude":"37.3531054","longitude":"126.7173640"},{"latitude":"37.3516909","longitude":"126.7197748"},{"latitude":"37.3502163","longitude":"126.7224049"},{"latitude":"37.3502836","longitude":"126.7224698"},{"latitude":"37.3503094","longitude":"126.7224947"},{"latitude":"37.3499404","longitude":"126.7230514"},{"latitude":"37.3485458","longitude":"126.7253522"},{"latitude":"37.3485348","longitude":"126.7253409"},{"latitude":"37.3483213","longitude":"126.7251463"},{"latitude":"37.3483244","longitude":"126.7251387"},{"latitude":"37.3480028","longitude":"126.7247694"}]');

INSERT INTO balance (user_email, type, amount, available)
VALUES ('rs', 'ADS', '48611', '48611');

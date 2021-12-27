const schema = {
    'Ngày sinh': {
        prop: 'date_of_birth',
        type: Date
    },
    'Ngày cấp': {
        prop: 'date_of_issue',
        type: Date,
    },
    'SĐT': {
        prop: 'phone_number',
        type: String,
    },
    'Địa chỉ thường trú': {
        prop: 'perm_address',
        type: String,
    },
    'CIF': {
        prop: 'cif',
        type: String,
    },
    'CMND/CCCD/HC': {
        prop: 'identification_number',
        type: String,
    },
    'Họ Tên khách hàng': {
        prop: 'full_name',
        type: String,
    },
    'GIỚI TÍNH': {
        prop: 'gender',
        type: String,
    },
    'TÌNH TRẠNG HÔN NHÂN': {
        prop: 'marital_status',
        type: String,
    },
    'KẾT QUẢ XẾP HẠNG': {
        prop: 'credit_rating_result',
        type: String,
    },
    'ID chấm điểm xếp hạng tín dụng': {
        prop: 'credit_rating_id',
        type: String,
    },
    'Hạn mức TỐI ĐA (triệu đồng)': {
        prop: 'total_pre_approval_limit',
        type: Number,
    },
    'Hạn mức TIỀN NHANH (triệu đồng)': {
        prop: 'total_pa_limit_fast_money',
        type: Number,
    },
    'Hạn mức MUA TRƯỚC TRẢ SAU (triệu đồng)': {
        prop: 'total_pa_limit_buynow_paylater',
        type: Number,
    },
    'Hạn mức VAY LINH HOẠT (triệu đồng)': {
        prop: 'total_pa_limit_flexible_loan',
        type: Number,
    },
    
}

module.exports = schema
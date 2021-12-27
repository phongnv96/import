module.exports = (sequelize, Sequelize) => {
    const PreApproval = sequelize.define("pre_approval", {
        identification_number: {
            type: Sequelize.STRING
        },
        total_pre_approval_limit: {
            type: Sequelize.BIGINT
        },
        total_pa_limit_fast_money: {
            type: Sequelize.BIGINT
        },
        total_pa_limit_buynow_paylater: {
            type: Sequelize.BIGINT
        },
        total_pa_limit_flexible_loan: {
            type: Sequelize.BIGINT
        },
        date_of_birth: {
            type: Sequelize.DATE
        },
        date_of_issue: {
            type: Sequelize.DATE
        },
        place_of_issue: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING
        },
        perm_address: {
            type: Sequelize.STRING
        },
        cif: {
            type: Sequelize.STRING
        },
        full_name: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        marital_status: {
            type: Sequelize.STRING
        },
        credit_rating_result: {
            type: Sequelize.STRING
        },
        credit_rating_id: {
            type: Sequelize.STRING
        }
    });

    return PreApproval;
};
const mongoose = require("mongoose");

const rolePermissionMappingSchema = new mongoose.Schema(
    {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserRole",
            required: true,
        },
        permissions: {
            type: [String],
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model(
    "RolePermissionMapping",
    rolePermissionMappingSchema,
    "rolepermissionmappings"
);

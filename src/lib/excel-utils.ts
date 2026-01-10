import * as XLSX from 'xlsx';

export interface TripTemplateImportRow {
    "Mã tham chiếu": string | number;
    "Tên mẫu": string;
    "Mô tả mẫu"?: string;
    "Phí"?: number;
    "Công khai"?: boolean;
    "ID Tỉnh"?: string;
    "Ngày số": number;
    "Tiêu đề ngày": string;
    "Mô tả ngày"?: string;
    "Thứ tự hoạt động": number;
    "Tên hoạt động": string;
    "Giờ bắt đầu"?: string;
    "Thời lượng (phút)"?: number;
    "Địa điểm"?: string;
    "Ghi chú"?: string;
    "Quan trọng"?: boolean;
}

export function generateSampleExcel(): Uint8Array {
    const data: TripTemplateImportRow[] = [
        // Template 1: Hanoi City Tour (1 day) - "Khám phá Hà Nội"
        {
            "Mã tham chiếu": "HN_01",
            "Tên mẫu": "Khám phá Hà Nội ngàn năm văn hiến",
            "Mô tả mẫu": "Hành trình tham quan các địa điểm lịch sử và văn hóa nổi tiếng tại thủ đô Hà Nội trong 1 ngày.",
            "Phí": 500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 1,
            "Tiêu đề ngày": "Tham quan nội thành",
            "Mô tả ngày": "Lịch trình dày đặc các điểm đến thú vị",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Đón khách",
            "Giờ bắt đầu": "08:00",
            "Thời lượng (phút)": 30,
            "Địa điểm": "Khách sạn khu vực Phố Cổ",
            "Ghi chú": "Hướng dẫn viên sẽ liên hệ trước",
            "Quan trọng": true
        },
        {
            "Mã tham chiếu": "HN_01",
            "Tên mẫu": "Khám phá Hà Nội ngàn năm văn hiến",
            "Mô tả mẫu": "",
            "Phí": 500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 1,
            "Tiêu đề ngày": "Tham quan nội thành",
            "Mô tả ngày": "",
            "Thứ tự hoạt động": 2,
            "Tên hoạt động": "Lăng Bác",
            "Giờ bắt đầu": "09:00",
            "Thời lượng (phút)": 90,
            "Địa điểm": "Quảng trường Ba Đình",
            "Ghi chú": "Yêu cầu trang phục trang trọng",
            "Quan trọng": true
        },
        {
            "Mã tham chiếu": "HN_01",
            "Tên mẫu": "Khám phá Hà Nội ngàn năm văn hiến",
            "Mô tả mẫu": "",
            "Phí": 500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 1,
            "Tiêu đề ngày": "Tham quan nội thành",
            "Mô tả ngày": "",
            "Thứ tự hoạt động": 3,
            "Tên hoạt động": "Văn Miếu Quốc Tử Giám",
            "Giờ bắt đầu": "14:00",
            "Thời lượng (phút)": 60,
            "Địa điểm": "58 Quốc Tử Giám",
            "Ghi chú": "",
            "Quan trọng": false
        },

        // Template 2: Danang - Hoi An (3 days) - "Đà Nẵng - Hội An"
        {
            "Mã tham chiếu": "DN_HA_02",
            "Tên mẫu": "Đà Nẵng - Hội An: Di sản miền Trung",
            "Mô tả mẫu": "Chuyến đi 3 ngày 2 đêm khám phá thành phố đáng sống và phố cổ Hội An.",
            "Phí": 2500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 1,
            "Tiêu đề ngày": "Đến Đà Nẵng",
            "Mô tả ngày": "Nhận phòng và tắm biển",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Check-in Khách sạn",
            "Giờ bắt đầu": "14:00",
            "Thời lượng (phút)": 30,
            "Địa điểm": "Khách sạn ven biển Mỹ Khê",
            "Ghi chú": "",
            "Quan trọng": true
        },
        {
            "Mã tham chiếu": "DN_HA_02",
            "Tên mẫu": "Đà Nẵng - Hội An: Di sản miền Trung",
            "Mô tả mẫu": "",
            "Phí": 2500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 1,
            "Tiêu đề ngày": "Đến Đà Nẵng",
            "Mô tả ngày": "",
            "Thứ tự hoạt động": 2,
            "Tên hoạt động": "Tắm biển Mỹ Khê",
            "Giờ bắt đầu": "16:00",
            "Thời lượng (phút)": 120,
            "Địa điểm": "Bãi biển Mỹ Khê",
            "Ghi chú": "Mang theo đồ bơi",
            "Quan trọng": false
        },
        {
            "Mã tham chiếu": "DN_HA_02",
            "Tên mẫu": "Đà Nẵng - Hội An: Di sản miền Trung",
            "Mô tả mẫu": "",
            "Phí": 2500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 2,
            "Tiêu đề ngày": "Khám phá Hội An",
            "Mô tả ngày": "Di chuyển vào Hội An tham quan phố cổ",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Rừng dừa Bảy Mẫu",
            "Giờ bắt đầu": "09:00",
            "Thời lượng (phút)": 120,
            "Địa điểm": "Cẩm Thanh, Hội An",
            "Ghi chú": "Trải nghiệm thuyền thúng",
            "Quan trọng": false
        },
        {
            "Mã tham chiếu": "DN_HA_02",
            "Tên mẫu": "Đà Nẵng - Hội An: Di sản miền Trung",
            "Mô tả mẫu": "",
            "Phí": 2500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 2,
            "Tiêu đề ngày": "Khám phá Hội An",
            "Mô tả ngày": "",
            "Thứ tự hoạt động": 2,
            "Tên hoạt động": "Dạo phố cổ",
            "Giờ bắt đầu": "18:00",
            "Thời lượng (phút)": 180,
            "Địa điểm": "Phố cổ Hội An",
            "Ghi chú": "Thả hoa đăng",
            "Quan trọng": true
        },
        {
            "Mã tham chiếu": "DN_HA_02",
            "Tên mẫu": "Đà Nẵng - Hội An: Di sản miền Trung",
            "Mô tả mẫu": "",
            "Phí": 2500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 3,
            "Tiêu đề ngày": "Tạm biệt",
            "Mô tả ngày": "Mua sắm và ra sân bay",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Chợ Hàn",
            "Giờ bắt đầu": "09:00",
            "Thời lượng (phút)": 60,
            "Địa điểm": "Trung tâm Đà Nẵng",
            "Ghi chú": "Mua đặc sản làm quà",
            "Quan trọng": false
        },

        // Template 3: Ha Giang Loop (4 days) - "Hà Giang Hùng Vĩ"
        {
            "Mã tham chiếu": "HG_03",
            "Tên mẫu": "Hà Giang - Cao nguyên đá Đồng Văn",
            "Mô tả mẫu": "Chinh phục những cung đường đèo đẹp nhất Việt Nam.",
            "Phí": 3500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 1,
            "Tiêu đề ngày": "Hà Nội - Hà Giang",
            "Mô tả ngày": "Di chuyển lên thành phố Hà Giang",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Xe Limousine đón",
            "Giờ bắt đầu": "07:00",
            "Thời lượng (phút)": 360,
            "Địa điểm": "Nhà Hát Lớn Hà Nội",
            "Ghi chú": "Nghỉ trưa tại Tuyên Quang",
            "Quan trọng": true
        },
        {
            "Mã tham chiếu": "HG_03",
            "Tên mẫu": "Hà Giang - Cao nguyên đá Đồng Văn",
            "Mô tả mẫu": "",
            "Phí": 3500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 2,
            "Tiêu đề ngày": "Đồng Văn - Mã Pí Lèng",
            "Mô tả ngày": "Khám phá vẻ đẹp hùng vĩ",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Cổng trời Quản Bạ",
            "Giờ bắt đầu": "08:30",
            "Thời lượng (phút)": 45,
            "Địa điểm": "Quản Bạ",
            "Ghi chú": "Chụp ảnh Núi Đôi",
            "Quan trọng": false
        },
        {
            "Mã tham chiếu": "HG_03",
            "Tên mẫu": "Hà Giang - Cao nguyên đá Đồng Văn",
            "Mô tả mẫu": "",
            "Phí": 3500000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 3,
            "Tiêu đề ngày": "Sông Nho Quế",
            "Mô tả ngày": "Du thuyền trên sông",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Bến thuyền Nho Quế",
            "Giờ bắt đầu": "09:00",
            "Thời lượng (phút)": 90,
            "Địa điểm": "Hẻm Tu Sản",
            "Ghi chú": "Mặc áo phao",
            "Quan trọng": true
        },

        // Template 4: Phu Quoc (3 days) - "Nghỉ dưỡng Phú Quốc"
        {
            "Mã tham chiếu": "PQ_04",
            "Tên mẫu": "Thiên đường nghỉ dưỡng Phú Quốc",
            "Mô tả mẫu": "Thư giãn tại những bãi biển đẹp nhất hành tinh.",
            "Phí": 4000000,
            "Công khai": false,
            "ID Tỉnh": "",
            "Ngày số": 1,
            "Tiêu đề ngày": "Khám phá Bắc Đảo",
            "Mô tả ngày": "VinWonders và Grand World",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Safari Phú Quốc",
            "Giờ bắt đầu": "09:00",
            "Thời lượng (phút)": 180,
            "Địa điểm": "Gành Dầu",
            "Ghi chú": "Xem show biểu diễn thú",
            "Quan trọng": true
        },
        {
            "Mã tham chiếu": "PQ_04",
            "Tên mẫu": "Thiên đường nghỉ dưỡng Phú Quốc",
            "Mô tả mẫu": "",
            "Phí": 4000000,
            "Công khai": false,
            "ID Tỉnh": "",
            "Ngày số": 2,
            "Tiêu đề ngày": "Tour 4 Đảo",
            "Mô tả ngày": "Lặn ngắm san hô",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Cảng An Thới",
            "Giờ bắt đầu": "08:00",
            "Thời lượng (phút)": 30,
            "Địa điểm": "An Thới",
            "Ghi chú": "Lên cano",
            "Quan trọng": true
        },

        // Template 5: Saigon - Mekong (2 days) - "Sài Gòn - Miền Tây"
        {
            "Mã tham chiếu": "MT_05",
            "Tên mẫu": "Sài Gòn - Miền Tây sông nước",
            "Mô tả mẫu": "Trải nghiệm văn hóa chợ nổi và miệt vườn.",
            "Phí": 1200000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 1,
            "Tiêu đề ngày": "Mỹ Tho - Bến Tre",
            "Mô tả ngày": "Cù lao Thới Sơn và rạch dừa nước",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Chùa Vĩnh Tràng",
            "Giờ bắt đầu": "08:00",
            "Thời lượng (phút)": 45,
            "Địa điểm": "Mỹ Tho",
            "Ghi chú": "Kiến trúc độc đáo",
            "Quan trọng": false
        },
        {
            "Mã tham chiếu": "MT_05",
            "Tên mẫu": "Sài Gòn - Miền Tây sông nước",
            "Mô tả mẫu": "",
            "Phí": 1200000,
            "Công khai": true,
            "ID Tỉnh": "",
            "Ngày số": 2,
            "Tiêu đề ngày": "Chợ Nổi Cái Răng",
            "Mô tả ngày": "Văn hóa mua bán trên sông",
            "Thứ tự hoạt động": 1,
            "Tên hoạt động": "Bến Ninh Kiều",
            "Giờ bắt đầu": "05:00",
            "Thời lượng (phút)": 120,
            "Địa điểm": "Cần Thơ",
            "Ghi chú": "Dậy sớm đi chợ nổi",
            "Quan trọng": true
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Adjust column widths
    const wscols = [
        { wch: 15 }, // ReferenceId
        { wch: 35 }, // TemplateTitle
        { wch: 40 }, // TemplateDescription
        { wch: 12 }, // Fee
        { wch: 10 }, // IsPublic
        { wch: 15 }, // ProvinceId
        { wch: 10 }, // DayOrder
        { wch: 25 }, // DayTitle
        { wch: 30 }, // DayDescription
        { wch: 12 }, // ActivityOrder
        { wch: 30 }, // ActivityTitle
        { wch: 15 }, // StartTime
        { wch: 15 }, // Duration
        { wch: 25 }, // Location
        { wch: 25 }, // Notes
        { wch: 10 }, // Important
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách mẫu");

    // Write to buffer
    const buf = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    return new Uint8Array(buf);
}

export function parseExcelRows(fileData: ArrayBuffer): TripTemplateImportRow[] {
    const workbook = XLSX.read(fileData, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json<TripTemplateImportRow>(worksheet);
}

export interface GroupedTemplate {
    referenceId: string | number;
    title: string;
    description?: string;
    fee?: number;
    isPublic?: boolean;
    provinceId?: string;
    days: Record<number, {
        dayOrder: number;
        title: string;
        description?: string;
        activities: any[];
    }>;
}

export function groupRowsToTemplates(rows: TripTemplateImportRow[]) {
    const templatesMap = new Map<string | number, any>();

    // We keep track of days to avoid duplicating them if multiple activities belong to same day

    for (const row of rows) {
        // Map Vietnamese keys to English logic
        const refId = row["Mã tham chiếu"];
        if (!refId) continue;

        let template = templatesMap.get(refId);
        if (!template) {
            template = {
                title: row["Tên mẫu"],
                description: row["Mô tả mẫu"],
                fee: row["Phí"] || 0,
                isPublic: row["Công khai"] === true || String(row["Công khai"]).toLowerCase() === 'true',
                provinceId: row["ID Tỉnh"] || null,
                days: []
            };
            templatesMap.set(refId, template);
        }

        // Find or Create Day
        const dayOrder = row["Ngày số"];
        let day = template.days.find((d: any) => d.dayOrder === dayOrder);
        if (!day) {
            day = {
                dayOrder: dayOrder,
                title: row["Tiêu đề ngày"],
                description: row["Mô tả ngày"],
                activities: []
            };
            template.days.push(day);
        }

        // Add Activity
        if (row["Tên hoạt động"]) {
            day.activities.push({
                activityOrder: row["Thứ tự hoạt động"],
                title: row["Tên hoạt động"],
                startTime: row["Giờ bắt đầu"],
                durationMin: row["Thời lượng (phút)"],
                location: row["Địa điểm"],
                notes: row["Ghi chú"],
                important: row["Quan trọng"] === true || String(row["Quan trọng"]).toLowerCase() === 'true'
            });
        }
    }

    // Sort days and activities
    const result = Array.from(templatesMap.values());
    result.forEach(tmpl => {
        tmpl.days.sort((a: any, b: any) => a.dayOrder - b.dayOrder);
        tmpl.days.forEach((day: any) => {
            day.activities.sort((a: any, b: any) => a.activityOrder - b.activityOrder);
        });
    });

    return result;
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WaspWorkFlowCore.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SpringTourApply",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Area = table.Column<string>(nullable: true),
                    Price = table.Column<long>(nullable: false),
                    StartTime = table.Column<long>(nullable: false),
                    TotalDay = table.Column<int>(nullable: false),
                    ParticipantNum = table.Column<int>(nullable: false),
                    CreateUserId = table.Column<Guid>(nullable: false),
                    CreateUserName = table.Column<string>(nullable: true),
                    CounsellorOptions = table.Column<string>(nullable: true),
                    HeadTeacherOptions = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpringTourApply", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WFInstance",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    WFId = table.Column<Guid>(nullable: false),
                    BId = table.Column<Guid>(nullable: false),
                    BType = table.Column<string>(nullable: true),
                    Desc = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WFInstance", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WFLine",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    LineId = table.Column<Guid>(nullable: false),
                    WFId = table.Column<Guid>(nullable: false),
                    LineJson = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WFLine", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WFNode",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    WFId = table.Column<Guid>(nullable: false),
                    NodeJson = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WFNode", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WFNodeInstance",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    WFInstanceId = table.Column<Guid>(nullable: false),
                    WFNodeId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    UserName = table.Column<string>(nullable: true),
                    State = table.Column<int>(nullable: false),
                    ActionLogs = table.Column<string>(nullable: true),
                    WFId = table.Column<Guid>(nullable: false),
                    BId = table.Column<Guid>(nullable: false),
                    BType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WFNodeInstance", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WFTemplate",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Desc = table.Column<string>(nullable: true),
                    CreateUserId = table.Column<Guid>(nullable: false),
                    UpdateUserId = table.Column<Guid>(nullable: false),
                    CreateUserName = table.Column<string>(nullable: true),
                    UpdateUserName = table.Column<string>(nullable: true),
                    CreateTime = table.Column<long>(nullable: false),
                    UpdateTime = table.Column<long>(nullable: false),
                    IsDelete = table.Column<bool>(nullable: false),
                    Version = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WFTemplate", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WFToolTip",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    TipId = table.Column<Guid>(nullable: false),
                    WFId = table.Column<Guid>(nullable: false),
                    TipDef = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WFToolTip", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpringTourApply");

            migrationBuilder.DropTable(
                name: "WFInstance");

            migrationBuilder.DropTable(
                name: "WFLine");

            migrationBuilder.DropTable(
                name: "WFNode");

            migrationBuilder.DropTable(
                name: "WFNodeInstance");

            migrationBuilder.DropTable(
                name: "WFTemplate");

            migrationBuilder.DropTable(
                name: "WFToolTip");
        }
    }
}

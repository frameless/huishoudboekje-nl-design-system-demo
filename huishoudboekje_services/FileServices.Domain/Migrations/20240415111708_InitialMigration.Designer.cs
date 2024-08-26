﻿// <auto-generated />
using System;
using FileServices.Domain.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FileServices.Domain.Migrations
{
    [DbContext(typeof(FileServiceContext))]
    [Migration("20240415111708_InitialMigration")]
    partial class InitialMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("FileServices.Domain.Contexts.Models.File", b =>
                {
                    b.Property<Guid>("Uuid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("uuid");

                    b.Property<byte[]>("Bytes")
                        .IsRequired()
                        .HasColumnType("bytea")
                        .HasColumnName("bytes");

                    b.Property<long>("LastModified")
                        .HasColumnType("bigint")
                        .HasColumnName("last_modified");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<string>("Sha256")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("sha256");

                    b.Property<int>("Size")
                        .HasColumnType("integer")
                        .HasColumnName("size");

                    b.Property<int>("Type")
                        .HasColumnType("integer")
                        .HasColumnName("type");

                    b.Property<long>("UploadedAt")
                        .HasColumnType("bigint")
                        .HasColumnName("uploaded_at");

                    b.HasKey("Uuid");

                    b.HasIndex("Type");

                    b.HasIndex("UploadedAt");

                    b.ToTable("files");
                });

            modelBuilder.Entity("FileServices.Domain.Contexts.Models.FileType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.HasKey("Id");

                    b.ToTable("filetypes");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "CustomerStatementMessage"
                        },
                        new
                        {
                            Id = 2,
                            Name = "PaymentInstruction"
                        });
                });

            modelBuilder.Entity("FileServices.Domain.Contexts.Models.File", b =>
                {
                    b.HasOne("FileServices.Domain.Contexts.Models.FileType", "FileType")
                        .WithMany()
                        .HasForeignKey("Type")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileType");
                });
#pragma warning restore 612, 618
        }
    }
}

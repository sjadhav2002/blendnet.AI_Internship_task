# Generated by Django 5.0.6 on 2024-05-13 16:42

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user_api", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="company",
            name="symbol",
            field=models.CharField(max_length=50, primary_key=True, serialize=False),
        ),
    ]

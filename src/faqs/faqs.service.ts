import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';

@Injectable()
export class FAQService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFAQs(file: Express.Multer.File) {
    try {
      // Read the Excel file
      const workbook = XLSX.read(file.buffer, {
        type: 'buffer',
        cellDates: true,
      });

      // Assuming the first sheet contains the data
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate and transform data
      const faqs = jsonData.map((row) => {
        // Check if row has required fields
        if (!row['question'] || !row['answer']) {
          throw new Error(
            'Excel file must have "question" and "answer" columns',
          );
        }

        return {
          question: row['question'].toString().trim(),
          answer: row['answer'].toString().trim(),
        };
      });

      // Use transaction to ensure all FAQs are uploaded or none
      await this.prisma.$transaction(async (prisma) => {
        // Optional: Clear existing FAQs
        await prisma.fAQ.deleteMany();

        // Insert new FAQs
        await prisma.fAQ.createMany({
          data: faqs,
        });
      });

      return {
        success: true,
        count: faqs.length,
        message: `Successfully uploaded ${faqs.length} FAQs`,
      };
    } catch (error) {
      throw new Error(`Failed to upload FAQs: ${error.message}`);
    }
  }

  async getAllFAQs() {
    return this.prisma.fAQ.findMany({
      orderBy: {
        question: 'asc',
      },
    });
  }
}

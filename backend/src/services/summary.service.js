const prisma = require('../config/db');

/**
 * Get batch-level attendance summary (for Institution)
 */
const getBatchSummary = async (batchId) => {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      institution: true,
      programme: true,
      students: { include: { student: true } },
      sessions: {
        include: {
          attendances: true,
          _count: { select: { attendances: true } },
        },
      },
    },
  });

  if (!batch) {
    const err = new Error('Batch not found');
    err.statusCode = 404;
    throw err;
  }

  const totalSessions = batch.sessions.length;
  const totalStudents = batch.students.length;

  // Per-student summary
  const studentSummaries = batch.students.map((bs) => {
    const student = bs.student;
    let present = 0, late = 0, absent = 0;

    batch.sessions.forEach((session) => {
      const att = session.attendances.find((a) => a.studentId === student.id);
      if (att) {
        if (att.status === 'PRESENT') present++;
        else if (att.status === 'LATE') late++;
        else absent++;
      } else {
        absent++;
      }
    });

    const attended = present + late;
    const percentage = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;

    return { student, present, late, absent, attended, totalSessions, percentage };
  });

  // Overall batch stats
  const totalAttendanceRecords = batch.sessions.reduce((sum, s) => sum + s.attendances.length, 0);
  const presentCount = batch.sessions.reduce(
    (sum, s) => sum + s.attendances.filter((a) => a.status === 'PRESENT').length,
    0
  );
  const lateCount = batch.sessions.reduce(
    (sum, s) => sum + s.attendances.filter((a) => a.status === 'LATE').length,
    0
  );

  const overallPercentage =
    totalSessions > 0 && totalStudents > 0
      ? Math.round(((presentCount + lateCount) / (totalSessions * totalStudents)) * 100)
      : 0;

  return {
    batch,
    totalSessions,
    totalStudents,
    overallPercentage,
    studentSummaries,
  };
};

/**
 * Get institution-level summary (for Programme Manager)
 */
const getInstitutionSummary = async (institutionId) => {
  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    include: {
      batches: {
        include: {
          _count: { select: { students: true, sessions: true } },
          sessions: { include: { attendances: true } },
          students: true,
        },
      },
    },
  });

  if (!institution) {
    const err = new Error('Institution not found');
    err.statusCode = 404;
    throw err;
  }

  const batchSummaries = institution.batches.map((batch) => {
    const totalSessions = batch.sessions.length;
    const totalStudents = batch.students.length;
    const presentCount = batch.sessions.reduce(
      (sum, s) => sum + s.attendances.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length,
      0
    );
    const overallPercentage =
      totalSessions > 0 && totalStudents > 0
        ? Math.round((presentCount / (totalSessions * totalStudents)) * 100)
        : 0;

    return {
      batchId: batch.id,
      batchName: batch.name,
      totalSessions,
      totalStudents,
      overallPercentage,
    };
  });

  return { institution, batchSummaries };
};

/**
 * Get programme-wide summary (for Monitoring Officer / Manager)
 */
const getProgrammeSummary = async () => {
  const institutions = await prisma.institution.findMany({
    include: {
      batches: {
        include: {
          sessions: { include: { attendances: true } },
          students: true,
        },
      },
    },
  });

  const institutionSummaries = institutions.map((inst) => {
    let totalSessions = 0;
    let totalStudents = 0;
    let totalPresent = 0;

    inst.batches.forEach((batch) => {
      totalSessions += batch.sessions.length;
      totalStudents += batch.students.length;
      batch.sessions.forEach((session) => {
        totalPresent += session.attendances.filter(
          (a) => a.status === 'PRESENT' || a.status === 'LATE'
        ).length;
      });
    });

    const overallPercentage =
      totalSessions > 0 && totalStudents > 0
        ? Math.round((totalPresent / (totalSessions * totalStudents)) * 100)
        : 0;

    return {
      institutionId: inst.id,
      institutionName: inst.name,
      institutionCode: inst.code,
      totalBatches: inst.batches.length,
      totalSessions,
      totalStudents,
      overallPercentage,
    };
  });

  const grandTotal = {
    totalInstitutions: institutions.length,
    totalBatches: institutionSummaries.reduce((s, i) => s + i.totalBatches, 0),
    totalSessions: institutionSummaries.reduce((s, i) => s + i.totalSessions, 0),
    totalStudents: institutionSummaries.reduce((s, i) => s + i.totalStudents, 0),
    averageAttendance:
      institutionSummaries.length > 0
        ? Math.round(
            institutionSummaries.reduce((s, i) => s + i.overallPercentage, 0) /
              institutionSummaries.length
          )
        : 0,
  };

  return { institutionSummaries, grandTotal };
};

module.exports = { getBatchSummary, getInstitutionSummary, getProgrammeSummary };
